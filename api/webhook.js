export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const body = req.body;
  const prompt = process.env.SYSTEM_PROMPT || "Você é um agente médico que responde perguntas em linguagem natural.";
  const apiKey = process.env.OPENAI_API_KEY;

  const messages = [
    { role: "system", content: prompt },
    { role: "user", content: body.message || "Olá" }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: messages,
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Desculpe, não consegui responder.";

  res.status(200).json({ reply });
}
