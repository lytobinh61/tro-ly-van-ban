export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { mode, input } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Bạn là Trợ lý phân tích văn bản pháp luật, chuyên hỗ trợ đọc, phân tích, tóm tắt, giải thích, và so sánh các nghị định, thông tư. Luôn trả lời tiếng Việt, súc tích, thân thiện.",
          },
          {
            role: "user",
            content: `${mode}: ${input}`,
          },
        ],
      }),
    });

    const data = await response.json();
    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "Không có phản hồi.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
