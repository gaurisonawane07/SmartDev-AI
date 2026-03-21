import { generateChatResponse } from "../services/ai.service.js";
import AIRequest from "../models/AIRequest.js";
import User from "../models/user.model.js";
import Note from "../models/note.model.js";

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

        if (user.aiUsageCount >= user.monthlyRequestLimit) {
            return res.status(403).json({
                success: false,
                message: "You have reached your monthly AI request limit.",
            });
        }

        let chatSession;
        let messages = [];

        // Define a higher-quality system prompt for the developer assistant
        const SYSTEM_PROMPT = {
            role: "system",
            content: `You are SmartDev AI, a high-performance assistant for developers. 
            - Provide code that is clean, documented, and production-ready.
            - Use Markdown for responses (headers, tables, lists, and code blocks).
            - When explaining concepts, be concise but thorough.
            - Use your technical expertise to suggest best practices and optimizations.
            - Format your output neatly so it can be easily read in a chat interface.`
        };

        if (conversationId) {
            chatSession = await AIRequest.findOne({ _id: conversationId, user: req.user._id });
            if (!chatSession) {
                return res.status(404).json({ success: false, message: "Conversation not found" });
            }
            messages = [
                SYSTEM_PROMPT,
                ...chatSession.messages.map(m => ({ role: m.role, content: m.content }))
            ];
        } else {
            messages = [SYSTEM_PROMPT];
        }

        messages.push({ role: "user", content: message });

        const completion = await generateChatResponse(messages);
        const aiResponse = completion.choices[0].message.content;
        const tokensUsed = completion.usage?.total_tokens || 0;

        messages.push({ role: "assistant", content: aiResponse });

        if (chatSession) {
            chatSession.messages.push({ role: "user", content: message });
            chatSession.messages.push({ role: "assistant", content: aiResponse });
            chatSession.tokensUsed += tokensUsed;
            await chatSession.save();
        } else {
            chatSession = await AIRequest.create({
                user: req.user._id,
                title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
                messages: [
                    { role: "user", content: message },
                    { role: "assistant", content: aiResponse }
                ],
                tokensUsed,
                model: "llama-3.1-70b-versatile", // Using a high-quality model available on Groq
            });
        }

        user.aiUsageCount += 1;
        await user.save();

        res.status(200).json({
            success: true,
            data: aiResponse,
            conversationId: chatSession._id,
            usage: user.aiUsageCount,
            remaining: user.monthlyRequestLimit - user.aiUsageCount,
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