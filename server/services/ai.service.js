import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generateChatResponse = async (messages) => {
    try {
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages,
        });

        return completion;

    } catch (error) {
        console.error("AI Error:", error);
        throw new Error("AI generation failed");
    }
};