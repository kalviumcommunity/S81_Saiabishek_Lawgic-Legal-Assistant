// backend/src/controllers/multishotcontroller.js
import { callOpenRouter } from "../config/openrouter.js";

// optional: strip models that prepend <think>...</think>
const stripThinkTags = (text = "") =>
  text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

export const multiShotPrompt = async (req, res) => {
  try {
    const { userPrompt } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ success: false, error: "userPrompt is required" });
    }

    // ---- Multi-shot: provide multiple examples (Q -> A) to shape style/format ----
    const examples = [
      {
        q: "How do I file an FIR in India?",
        a: [
          "1) Visit the nearest police station (jurisdiction not mandatory for cognizable offences).",
          "2) Tell the officer the facts; ensure they record it in writing under Section 154 CrPC.",
          "3) Verify the statement, sign it, and ask for a free copy of the FIR.",
          "4) If refused, you may write to the Superintendent of Police with details.",
          "5) This is general information, not a substitute for legal advice."
        ].join("\n")
      },
      {
        q: "What should I do if my landlord refuses to return my security deposit?",
        a: [
          "1) Review your rental agreement for clauses on deposit refunds.",
          "2) Send a written notice demanding the deposit with a deadline.",
          "3) If still unpaid, file a complaint in the Rent Control Court or Small Causes Court.",
          "4) You may also send a legal notice through a lawyer to strengthen your claim.",
          "5) Keep records of rent paid and communications as evidence."
        ].join("\n")
      }
    ];

    const system = [
      "You are Lawgic, an Indian legal information assistant.",
      "Answer clearly in numbered steps.",
      "Cite relevant Indian laws/sections by name if applicable.",
      "Keep it concise. Do NOT include hidden reasoning or analysis; provide only the final answer."
    ].join(" ");

    // build conversation: system + multiple example Q&A + user prompt
    const messages = [{ role: "system", content: system }];
    examples.forEach(ex => {
      messages.push({ role: "user", content: ex.q });
      messages.push({ role: "assistant", content: ex.a });
    });
    messages.push({ role: "user", content: userPrompt });

    const data = await callOpenRouter(
      messages,
      "deepseek/deepseek-r1-0528:free"
    );

    const raw = data?.choices?.[0]?.message?.content ?? "";
    const cleaned = stripThinkTags(raw);

    return res.json({ success: true, response: cleaned || "[No response]" });
  } catch (error) {
    console.error("MultiShot Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
