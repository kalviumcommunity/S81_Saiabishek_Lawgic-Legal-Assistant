// backend/src/controllers/oneshotcontroller.js
import { callOpenRouter } from "../config/openrouter.js";

// optional: strip models that prepend <think>...</think>
const stripThinkTags = (text = "") =>
  text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

export const oneShotPrompt = async (req, res) => {
  try {
    const { userPrompt } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ success: false, error: "userPrompt is required" });
    }

    // ---- One-shot: provide exactly ONE example (Q -> A) to shape style/format ----
    const exampleQ = "How do I file an FIR in India?";
    const exampleA = [
      "1) Visit the nearest police station (jurisdiction not mandatory for cognizable offences).",
      "2) Tell the officer the facts; ensure they record it in writing under Section 154 CrPC.",
      "3) Verify the statement, sign it, and ask for a free copy of the FIR.",
      "4) If refused, you may write to the Superintendent of Police with details.",
      "5) This is general information, not a substitute for legal advice."
    ].join("\n");

    const system = [
      "You are Lawgic, an Indian legal information assistant.",
      "Answer clearly in numbered steps.",
      "Cite relevant Indian laws/sections by name if applicable.",
      "Keep it concise. Do NOT include hidden reasoning or analysis; provide only the final answer."
    ].join(" ");

    const data = await callOpenRouter(
      [
        { role: "system", content: system },
        // one example (user + assistant)
        { role: "user", content: exampleQ },
        { role: "assistant", content: exampleA },
        // real user prompt
        { role: "user", content: userPrompt }
      ],
      // pick a free, currently-available model you already configured
      "deepseek/deepseek-r1-0528:free"
    );

    const raw = data?.choices?.[0]?.message?.content ?? "";
    const cleaned = stripThinkTags(raw);

    return res.json({ success: true, response: cleaned || "[No response]" });
  } catch (error) {
    console.error("OneShot Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
