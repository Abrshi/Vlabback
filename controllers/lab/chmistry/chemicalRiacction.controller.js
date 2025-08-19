import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client"; 

dotenv.config();

const prisma = new PrismaClient();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

export const chemicalReaction = async (req, res) => {
  const { chemicals, temperature, user } = req.body; // ✅ make sure exType is passed in body
const exType='chmistry'
  try {
    console.log("Received chemicals:", chemicals, "at", temperature, "°C", "from user:", user.id);

    const prompt = `
You are a chemist AI.
A reaction occurs between: ${chemicals.join(" and ")} at ${temperature}°C.  
Return ONLY valid JSON with the following fields:
{
  "formula": "Balanced chemical equation with states (s, l, g, aq)",
  "reaction_type": "exothermic or endothermic",
  "color_gradient": "in tailwind like from-red-500 to-yellow-500 more realistic and accurate",
  "temperature": ${temperature},
  "observations": "short notes about the reaction outcome (gas release, precipitate, etc.)"
}
No extra words, no markdown, no code fences — only JSON.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const rawText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({ error: "No response from Gemini model." });
    }

    let cleanedText = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let jsonData;
    try {
      jsonData = JSON.parse(cleanedText);
    } catch (err) {
      console.error("Error parsing JSON from Gemini:", cleanedText);
      return res.status(500).json({ error: "Invalid JSON response from AI" });
    }

    // 1. Save full reaction record
    const savedReaction = await prisma.chemicalReactionResult.create({
      data: {
        user_id: user.id,
        formula: jsonData.formula,
        reaction_type: jsonData.reaction_type,
        color_gradient: jsonData.color_gradient,
        temperature: jsonData.temperature,
        observations: jsonData.observations,
      },
    });
    console.log("Chemical reaction saved to DB:", savedReaction.id);

    // 2. Update stats (track experiments count)
    if (exType) {
      await prisma.experimentStats.upsert({
        where: {
          user_id_exType: { user_id: user.id, exType }, // ✅ requires @@unique in schema
        },
        update: {
          count: { increment: 1 },
        },
        create: {
          user_id: user.id,
          exType,
          count: 1,
        },
      });
      console.log(`Experiment stats updated for ${exType}`);
    }

    // 3. Respond to client
    return res.json(jsonData);

  } catch (err) {
    console.error("Error handling chemical reaction:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
