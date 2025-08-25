import { callOpenRouter } from "../config/openrouter.js";

export const systemUserController = async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "userPrompt is required" });
    }

    // System prompt = the AI’s fixed persona/context
    const systemPrompt = `
      You are Lawgic AI, a helpful legal assistant.
      - Provide concise, clear, and user-friendly legal guidance.
      - Do NOT provide confidential or case-specific advice.
      - Always explain concepts in simple terms.
    `;

    // Send both system + user prompt
    const response = await callOpenRouter({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      top_p: 0.9,
    });

    const message = response?.choices?.[0]?.message?.content || "No response";

    res.json({ response: message });
  } catch (err) {
    console.error("System/User Prompt error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
