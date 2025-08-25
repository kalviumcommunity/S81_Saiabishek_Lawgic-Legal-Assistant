import { callOpenRouter } from "../config/openrouter.js";

const stripThinkTags = (text = "") =>
  text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

const parseJSONSafe = (s) => {
  try { return JSON.parse(s); } catch { return null; }
};

export const chainOfThoughtController = async (req, res) => {
  try {
    const {
      userPrompt,
      temperature = 0.4,
      top_p = 0.9,
      n = 3, // number of samples for self-consistency
      model = "gpt-4o-mini",
    } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "userPrompt is required" });
    }

    const system = [
      "You are Lawgic AI Assistant.",
      "Think step by step inside <think>...</think> tags.",
      "After thinking, output ONLY a compact JSON object with keys:",
      '  "final": the answer the user should see,',
      '  "notes": optional; up to 2 short bullet points.',
      "Never include <think> content in the JSON. No markdown, no extra text.",
    ].join(" ");

    const payload = {
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature,
      top_p,
      n, // request multiple choices
      // Some models support reasoning controls; enable only if your model supports it:
      // reasoning: { effort: "medium" },
    };

    const resp = await callOpenRouter(payload);
    const choices = resp?.choices || [];
    if (!choices.length) {
      return res.status(502).json({ error: "No choices returned by model" });
    }

    // Extract structured results from each choice
    const results = [];
    for (const ch of choices) {
      const raw = ch?.message?.content ?? "";
      const safe = stripThinkTags(raw);

      // try to isolate the JSON region
      const first = safe.indexOf("{");
      const last = safe.lastIndexOf("}");
      const jsonSlice =
        first >= 0 && last >= first ? safe.slice(first, last + 1) : null;
      const obj = jsonSlice ? parseJSONSafe(jsonSlice) : null;

      if (obj?.final) {
        results.push({
          final: String(obj.final).trim(),
          notes: obj.notes ?? null,
        });
      }
    }

    // If parsing failed, just return stripped text from the first choice
    if (!results.length) {
      const raw0 = choices[0]?.message?.content ?? "";
      return res.json({ final: stripThinkTags(raw0) });
    }

    // Self-consistency: pick most frequent `final`
    const tally = new Map();
    for (const r of results) {
      const key = r.final;
      tally.set(key, (tally.get(key) || 0) + 1);
    }

    let bestFinal = results[0].final;
    let bestNotes = results[0].notes ?? null;
    let bestCount = 0;

    for (const [k, v] of tally) {
      if (v > bestCount) {
        bestCount = v;
        bestFinal = k;
        // pick any notes from a result that matches k
        const found = results.find((r) => r.final === k);
        bestNotes = found?.notes ?? null;
      }
    }

    return res.json({
      final: bestFinal,
      notes: bestNotes,
      meta: { samples: choices.length, agreed: bestCount },
    });
  } catch (err) {
    console.error("COT error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
