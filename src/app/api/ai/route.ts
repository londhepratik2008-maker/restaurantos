import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, data } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your-gemini-api-key") {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const systemPrompt = `You are an AI assistant for a restaurant management platform called RestaurantOS. You help restaurant owners with:
- Demand forecasting and sales predictions
- Menu optimization (pricing, popularity analysis)
- Waste reduction strategies
- Staffing recommendations
- Inventory management insights
- Customer retention strategies

Be concise, actionable, and data-driven. Use bullet points where helpful. Respond in plain text (no markdown).`;

    const fullPrompt = data
      ? `${systemPrompt}\n\nHere is the restaurant's data:\n${JSON.stringify(data, null, 2)}\n\nUser query: ${prompt}`
      : `${systemPrompt}\n\nUser query: ${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data2 = await response.json();
    const text =
      data2?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't process that request. Please try again.";

    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
