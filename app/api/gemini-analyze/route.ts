import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Augmenter le timeout pour les analyses longues (en secondes)
export const maxDuration = 60; // 60 secondes au lieu de 10 par défaut

export async function POST(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.warn(`[${requestId}] API /api/gemini-analyze called`);
  try {
    const { url, prompt, systemInstruction } = await req.json();
    
    // Validation de l'URL
    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ error: "URL manquante ou invalide" }, { status: 400 });
    }
    
    // Normaliser l'URL
    const normalizedUrl = url.trim();
    console.warn(`[${requestId}] Analyzing URL: ${normalizedUrl}`);
    
    // Vérifier que l'URL est valide
    try {
      new URL(normalizedUrl);
    } catch (e) {
      return NextResponse.json({ error: "Format d'URL invalide" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Clé API Gemini manquante" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Modèles Gemini disponibles (mis à jour en 2026)
    // Ordre de priorité : Pro (plus fiable) > Flash (plus rapide) > Lite (fallback)
    const modelsToTry = [
      "gemini-2.5-pro",      // Le plus performant et fiable pour analyses complexes
      "gemini-2.0-pro",      // Pro alternatif
      "gemini-2.5-flash",    // Bon équilibre vitesse/qualité
      "gemini-2.0-flash",    // Flash alternatif
      "gemini-2.0-flash-lite" // Fallback léger
    ];

    let lastError: any = null;
    
    // Essayer chaque modèle jusqu'à en trouver un qui fonctionne
    for (const modelName of modelsToTry) {
      try {
        console.warn(`Tentative avec le modèle: ${modelName}`);
        
        // Configuration stateless : chaque appel est indépendant, sans historique
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
          // Pas de cachedContent pour garantir une analyse fraîche à chaque fois
        });

        const generationConfig = { 
          temperature: 0.2, // Déterminisme accru pour extraction factuelle
          topP: 0.85, // Réduit pour limiter l'interprétation créative
          topK: 20, // Réduit pour forcer des choix plus consensuels
          maxOutputTokens: 8192 
        };
        
        const safetySettings = [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ];

        // Appel stateless : génération unique sans historique de conversation
        // Remplacer TOUTES les occurrences de {$url} ou **url** dans le prompt
        const fullPrompt = prompt.replace(/\{\$url\}|\*\*url\*\*/g, normalizedUrl);
        
        // Logger une partie du prompt pour vérifier le remplacement
        const promptPreview = fullPrompt.substring(0, 200);
        console.warn(`[${requestId}] Prompt preview: ${promptPreview}...`);
        
        const result = await model.generateContent(fullPrompt, { generationConfig, safetySettings });
        
        const responseText = result.response.text();
        
        // Logging pour debug : extraire section métadonnées si présente
        const metadataMatch = responseText.match(/\[SECTION INTERNE[\s\S]*?FIN SECTION INTERNE\]/i);
        if (metadataMatch) {
          console.warn(`[${requestId}] Métadonnées extraites (debug):`, metadataMatch[0]);
        }
        
        // Extraire Nature de l'entité pour validation
        const entityMatch = responseText.match(/Nature de l'entité[:\s]*([^\n—]+)/i);
        if (entityMatch) {
          console.warn(`[${requestId}] Entité détectée: ${entityMatch[1].trim()}`);
        }
        
        console.warn(`[${requestId}] Succès avec le modèle: ${modelName}`);
        return NextResponse.json({ text: responseText, model: modelName, requestId });
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
