import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key présente:', !!apiKey);
    console.log('API Key length:', apiKey?.length);
    
    if (!apiKey) {
      return NextResponse.json({ error: "Clé API Gemini manquante" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('Tentative de listage des modèles...');
    // Lister tous les modèles disponibles
    const models = await genAI.listModels();
    console.log('Modèles récupérés:', models.length);
    
    const modelsList = models.map(model => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedGenerationMethods: model.supportedGenerationMethods,
    }));

    return NextResponse.json({ 
      models: modelsList,
      count: modelsList.length 
    });
  } catch (err: any) {
    console.error('Error listing models:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    return NextResponse.json({ 
      error: err.message || "Erreur serveur",
      details: err.toString(),
      stack: err.stack
    }, { status: 500 });
  }
}
