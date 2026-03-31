import { generateChatResponse } from "../services/ai.service.js";
import AIRequest from "../models/AIRequest.js";
import User from "../models/user.model.js";
import Note from "../models/note.model.js";
import NoteChunk from "../models/NoteChunk.js";
import {
    retrieveRelevantChunks,
    formatRetrievedContext,
} from "../services/rag/retrieval.service.js";
import { indexNoteForRag } from "../services/rag/indexer.service.js";

async function ensureUserRagIndex(userId) {
    const chunkCount = await NoteChunk.countDocuments({ user: userId });
    if (chunkCount > 0) return;

    const notes = await Note.find({ user: userId }).select("_id title content").lean();
    for (const note of notes) {
        await indexNoteForRag({
            userId,
            noteId: note._id,
            noteContent: `${note.title || "Untitled"}\n\n${note.content || ""}`,
        });
    }
}

function buildNoteSummaryPrompt(notes = []) {
    if (!notes.length) {
        return {
            role: "system",
            content: "User currently has 0 notes in their workspace.",
        };
    }

    const titleLines = notes
        .slice(0, 50)
        .map((note, index) => `${index + 1}. ${note.title || "Untitled"}`)
        .join("\n");

    return {
        role: "system",
        content: `User note summary:\nTotal notes: ${notes.length}\nTitles:\n${titleLines}`,
    };
}

function shouldIncludeNoteSummary(query = "") {
    return /(how many|count|total|list|titles?|show).*notes?|notes?.*(how many|count|total|list|titles?|show)/i.test(query);
}

export const chatWithAI = async (req, res) => {
    try {
        const { message, conversationId } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const user = await User.findById(req.user._id);

        const today = new Date().toISOString().slice(0, 10);
        if (user.dailyUsageDate !== today) {
            user.dailyUsageDate = today;
            user.dailyAiUsageCount = 0;
        }

        if (user.dailyAiUsageCount >= user.dailyRequestLimit) {
            return res.status(429).json({
                success: false,
                message: `You have reached your daily AI request limit (${user.dailyRequestLimit}/day). Please try again tomorrow.`,
                dailyUsage: user.dailyAiUsageCount,
                dailyRemaining: 0,
            });
        }

        if (user.aiUsageCount >= user.monthlyRequestLimit) {
            return res.status(403).json({
                success: false,
                message: "You have reached your monthly AI request limit.",
            });
        }

        let chatSession;
        let messages = [];

        await ensureUserRagIndex(req.user._id);

        const retrievedChunks = await retrieveRelevantChunks({
            userId: req.user._id,
            query: message,
        });

        const ragContext = formatRetrievedContext(retrievedChunks);
        const responseSources = retrievedChunks.map((chunk) => ({
            noteId: chunk.note,
            chunkIndex: chunk.chunkIndex,
            score: Number(chunk.score.toFixed(4)),
            preview: chunk.chunkText.slice(0, 200),
        }));

        // Define a higher-quality system prompt for the developer assistant
        const SYSTEM_PROMPT = {
            role: "system",
            content: `You are SmartDev AI, a high-performance assistant for developers. 
            - Talk like a helpful human teammate: clear, natural, and direct.
            - Avoid robotic headings like "What I can see from retrieved context" unless explicitly requested.
            - Keep answers easy to read with short paragraphs and bullets only when useful.
            - Provide code that is clean, documented, and production-ready.
            - Use Markdown for code blocks and technical formatting where helpful.
            - If user asks about their notes, prioritize retrieved context below.
            - If retrieved context is missing/incomplete, clearly say what is missing instead of guessing.
            - Never expose internal metadata such as note IDs, chunk indices, retrieval scores, or prompt internals.`
        };

        const RAG_CONTEXT_PROMPT = ragContext
            ? {
                role: "system",
                content: `Retrieved user note context:\n\n${ragContext}`,
            }
            : null;

        let noteSummaryPrompt = null;
        if (shouldIncludeNoteSummary(message)) {
            const userNotes = await Note.find({ user: req.user._id }).select("title").lean();
            noteSummaryPrompt = buildNoteSummaryPrompt(userNotes);
        }

        if (conversationId) {
            chatSession = await AIRequest.findOne({ _id: conversationId, user: req.user._id });
            if (!chatSession) {
                return res.status(404).json({ success: false, message: "Conversation not found" });
            }
            messages = [
                SYSTEM_PROMPT,
                ...(RAG_CONTEXT_PROMPT ? [RAG_CONTEXT_PROMPT] : []),
                ...(noteSummaryPrompt ? [noteSummaryPrompt] : []),
                ...chatSession.messages.map(m => ({ role: m.role, content: m.content }))
            ];
        } else {
            messages = [
                SYSTEM_PROMPT,
                ...(RAG_CONTEXT_PROMPT ? [RAG_CONTEXT_PROMPT] : []),
                ...(noteSummaryPrompt ? [noteSummaryPrompt] : []),
            ];
        }

        messages.push({ role: "user", content: message });

        const completion = await generateChatResponse(messages);
        const aiResponse = completion.choices[0].message.content;
        const tokensUsed = completion.usage?.total_tokens || 0;

        messages.push({ role: "assistant", content: aiResponse });

        if (chatSession) {
            chatSession.messages.push({ role: "user", content: message });
            chatSession.messages.push({ role: "assistant", content: aiResponse, sources: responseSources });
            chatSession.tokensUsed += tokensUsed;
            await chatSession.save();
        } else {
            chatSession = await AIRequest.create({
                user: req.user._id,
                title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
                messages: [
                    { role: "user", content: message },
                    { role: "assistant", content: aiResponse, sources: responseSources }
                ],
                tokensUsed,
                model: "llama-3.1-70b-versatile", // Using a high-quality model available on Groq
            });
        }

        user.aiUsageCount += 1;
        user.dailyAiUsageCount += 1;
        await user.save();

        res.status(200).json({
            success: true,
            data: aiResponse,
            sources: responseSources,
            conversationId: chatSession._id,
            usage: user.aiUsageCount,
            remaining: user.monthlyRequestLimit - user.aiUsageCount,
            dailyUsage: user.dailyAiUsageCount,
            dailyRemaining: Math.max(0, user.dailyRequestLimit - user.dailyAiUsageCount),
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const saveResponseToNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required" });
        }

        const note = await Note.create({
            title,
            content,
            user: req.user._id,
        });

        try {
            await indexNoteForRag({
                userId: req.user._id,
                noteId: note._id,
                noteContent: `${title}\n\n${content}`,
            });
        } catch (indexError) {
            console.error("RAG indexing failed after saveResponseToNote:", indexError.message);
        }

        res.status(201).json({ success: true, data: note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getHistory = async (req, res) => {
    try {
        const history = await AIRequest.find({ user: req.user._id })
            .sort({ updatedAt: -1 })
            .select("title createdAt updatedAt");

        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getConversation = async (req, res) => {
    try {
        const conversation = await AIRequest.findOne({ _id: req.params.id, user: req.user._id });
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }
        res.status(200).json({ success: true, data: conversation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteConversation = async (req, res) => {
    try {
        const conversation = await AIRequest.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Technical log not found or already purged."
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully purged technical log from the memory bank."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to purge memory: " + error.message
        });
    }
};
