import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client"; 

dotenv.config();

const prisma = new PrismaClient();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

export const chemicalReaction = async (req, res) => {
  const { chemicals, temperature, user } = req.body; // expects user object or userId
  const exType = 'chmistry';

  try {
    // ✅ Ensure we have a valid numeric userId
    const userId = Number(user?.id || user); // supports user object or just userId
    if (!userId) {
      return res.status(400).json({ error: "Invalid or missing userId" });
    }

    // ✅ Verify user exists
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Received chemicals:", chemicals, "at", temperature, "°C", "from user:", userId);

    // 🔹 Prepare AI prompt
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

    // 🔹 Call Google Gemini AI
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const rawText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({ error: "No response from Gemini model." });
    }

    // 🔹 Clean and parse AI JSON
    const cleanedText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    let jsonData;
    try {
      jsonData = JSON.parse(cleanedText);
    } catch (err) {
      console.error("Error parsing JSON from Gemini:", cleanedText);
      return res.status(500).json({ error: "Invalid JSON response from AI" });
    }

    // 🔹 Save chemical reaction to DB safely
    const savedReaction = await prisma.chemicalReactionResult.create({
      data: {
        formula: jsonData.formula,
        reaction_type: jsonData.reaction_type,
        color_gradient: jsonData.color_gradient,
        temperature: jsonData.temperature,
        observations: jsonData.observations,
        user: {
          connect: { id: userId }, // ✅ Prisma relation ensures FK exists
        },
      },
    });
    console.log("Chemical reaction saved to DB:", savedReaction.id);

    // 🔹 Update experiment stats
    await prisma.experimentStats.upsert({
      where: { user_id_exType: { user_id: userId, exType } },
      update: { count: { increment: 1 } },
      create: { user_id: userId, exType, count: 1 },
    });
    console.log(`Experiment stats updated for ${exType}`);

    // 🔹 Respond to client
    return res.json(jsonData);

  } catch (err) {
    console.error("Error handling chemical reaction:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
