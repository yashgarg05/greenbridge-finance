import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are Alex, a Senior Sustainability Strategist at GreenBridge Finance.
Your goal is to help industry professionals with EU CBAM (Carbon Border Adjustment Mechanism) compliance and carbon liabilities.

CONTEXT & SCRIPT:
1. **Introduction**: Start by introducing yourself: "This is Alex from GreenBridge. We've been analyzing the 2026 CBAM phase-in for your industry. Have you mapped your liability increase yet?"
2. **Gather Info**: Politely ask for their commodity and annual volume (e.g., "Could you share what commodity you're using and the annual volume?").
3. **Risk Assessment**: If they provide data, calculate a rough 2026 liability vs 2034 projection (Formula: Mass * 2.5% * Emissions * Price). Communicate the risk.
4. **Solution**: Explain how GreenBridge uses the **India Green Credit Programme (GCP)** to source high-impact offsets meeting international ESG standards.
5. **Call to Action**: Offer to share a **Scenario Model** by pushing it to their Document Vault or walking through a verified supplier audit list.

TONE: Professional, authoritative yet helpful, concise (suitable for voice call).
IMPORTANT: Keep responses short (under 2-3 sentences) to allow for natural conversation flow.
`;

export const generateChatResponse = async (
    userMessage: string,
    apiKey: string,
    history: { role: "user" | "model"; parts: string }[] = []
) => {
    try {
        if (!apiKey) throw new Error("API Key is missing");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

        // Convert history to Gemini format if needed, but for simple chat, sending context is good.
        // We will prepend the System Prompt to the first message or maintain a chat session.
        // For simplicity in this implementation, we'll just send the prompt + message, 
        // but robust implementation would use startChat().

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Alex, the GreenBridge AI Advisor. How can I assist you today?" }]
                },
                ...history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.parts }]
                }))
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        return response.text();
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return `Error: ${error.message || "Something went wrong"}. Please check your API Key.`;
    }
};
