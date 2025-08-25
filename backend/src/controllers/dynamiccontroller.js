import { callOpenRouter } from "../config/openrouter.js";

export const dynamicPromptController = async (req, res) => {
  try {
    const {
      userPrompt,
      role = "general",   // e.g., "student", "lawyer", "beginner"
      tone = "simple",    // e.g., "simple", "professional", "detailed"
      history = []        // optional: conversation history [{role, content}, ...]
    } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "userPrompt is required" });
    }

    // 🔹 Build system prompt dynamically
    let systemPrompt = "You are Lawgic AI, a legal assistant.";

    if (role === "student") {
      systemPrompt += " Explain laws with simple examples for beginners.";
    } else if (role === "lawyer") {
      systemPrompt += " Provide detailed, technical legal insights with references.";
    }

    if (tone === "simple") {
      systemPrompt += " Keep the answer short and easy to understand.";
    } else if (tone === "professional") {
      systemPrompt += " Use a formal and professional tone.";
    }

    // 🔹 Construct message stack
    const messages = [
      { role: "system", content: systemPrompt },
      ...history, // keep past conversation if provided
      { role: "user", content: userPrompt }
    ];

    // 🔹 Send to OpenRouter
    const response = await callOpenRouter({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      top_p: 0.9,
    });

    const message = response?.choices?.[0]?.message?.content || "No response";

    res.json({
      roleUsed: role,
      toneUsed: tone,
      response: message,
    });
  } catch (err) {
    console.error("Dynamic Prompt error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
