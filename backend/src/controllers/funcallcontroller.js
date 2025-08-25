import { callOpenRouter } from "../config/openrouter.js";

// Example controller for function calling
export const functionCallingController = async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "userPrompt is required" });
    }

    // Example function schema: get current time
    const functions = [
      {
        name: "get_current_time",
        description: "Get the current server time",
        parameters: {
          type: "object",
          properties: {},
        },
      },
    ];

    // Call OpenRouter (or OpenAI API)
    const response = await callOpenRouter({
      model: "gpt-4o-mini", // or your chosen model
      messages: [{ role: "user", content: userPrompt }],
      functions,
      function_call: "auto", // let model decide
    });

    res.json({ response });
  } catch (error) {
    console.error("Function calling error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
