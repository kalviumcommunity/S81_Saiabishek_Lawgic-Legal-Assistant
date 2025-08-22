// backend/src/config/openrouter.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const callOpenRouter = async (messages, model) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      { model, messages },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("🔴 OpenRouter Full Error:", error.response.data);
      throw new Error(
        `OpenRouter error: ${JSON.stringify(error.response.data, null, 2)}`
      );
    }
    throw new Error(`OpenRouter error: ${error.message}`);
  }
};
