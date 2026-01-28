import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Augmenter le timeout pour les analyses longues (en secondes)
export const maxDuration = 60; // 60 secondes au lieu de 10 par défaut

export async function POST(req: NextRequest) {
  console.warn('API /api/gemini-analyze called');
  try {
    const { url, prompt, systemInstruction } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Clé API Gemini manquante" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Modèles Gemini disponibles (mis à jour en 2026)
    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.5-pro",
      "gemini-2.0-flash-lite"
    ];

    let lastError: any = null;
    
    // Essayer chaque modèle jusqu'à en trouver un qui fonctionne
    for (const modelName of modelsToTry) {
      try {
        console.warn(`Tentative avec le modèle: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
        });

        const generationConfig = { temperature: 0.1, topP: 0.8, topK: 1, maxOutputTokens: 8192 };
        const safetySettings = [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ];

        const fullPrompt = prompt.replace("{$url}", url);
        const result = await model.generateContent(fullPrompt, { generationConfig, safetySettings });
        console.warn(`Succès avec le modèle: ${modelName}`);
        return NextResponse.json({ text: result.response.text() });
      } catch (err: any) {
        console.warn(`Échec avec ${modelName}:`, err.message);
        lastError = err;
        // Continuer avec le prochain modèle
        continue;
      }
    }

    // Si aucun modèle n'a fonctionné
    throw new Error(`Aucun modèle Gemini disponible. Dernière erreur: ${lastError?.message || 'Inconnu'}`);

  } catch (err: any) {
    console.error('Server error:', err);
    return NextResponse.json({ error: err.message || "Erreur serveur" }, { status: 500 });
  }
}
