// backend/src/controllers/zeroshotcontroller.js
import { callOpenRouter } from "../config/openrouter.js";

export const zeroShotPrompt = async (req, res) => {
  try {
    const { userPrompt } = req.body;

    const data = await callOpenRouter(
      [{ role: "user", content: userPrompt }],
      "deepseek/deepseek-r1-0528:free"
    );

    res.json({
      success: true,
      response: data.choices[0]?.message?.content ?? "[No response]",
    });
  } catch (error) {
    console.error("ZeroShot Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
