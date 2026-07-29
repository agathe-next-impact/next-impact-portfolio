import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { error: "URL manquante ou invalide" },
        { status: 400 }
      );
    }

    const apiKey = process.env.WHATCMS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API WhatCMS manquante" },
        { status: 500 }
      );
    }

    // Nettoyer l'URL pour l'API (retirer le protocole si présent)
    const cleanUrl = url.trim().replace(/^https?:\/\//, "");

    const response = await fetch(
      `https://whatcms.org/API/Tech?key=${apiKey}&url=${encodeURIComponent(cleanUrl)}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur lors de l'appel à WhatCMS" },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Rate limiting
    if (data.result?.code === 120 || data.result?.code === 121) {
      return NextResponse.json(
        {
          error: "Service temporairement indisponible, veuillez réessayer dans quelques secondes",
          retryIn: data.retry_in_seconds || 10,
        },
        { status: 429 }
      );
    }

    // CMS non détecté
    if (data.result?.code === 201 || !data.results || data.results.length === 0) {
      return NextResponse.json({
        isWordPress: false,
        isMonolithic: false,
        detectedCms: null,
        message: "Aucun CMS détecté",
      });
    }

    // Chercher WordPress dans les résultats
    const wpResult = data.results.find(
      (r: { name: string }) => r.name.toLowerCase() === "wordpress"
    );

    if (wpResult) {
      return NextResponse.json({
        isWordPress: true,
        isMonolithic: true,
        detectedCms: "WordPress",
        message: "WordPress monolithique détecté",
      });
    }

    // Autre CMS détecté
    const cmsResults = data.results.filter(
      (r: { categories: string[] }) =>
        r.categories && r.categories.includes("CMS")
    );
    const mainCms = cmsResults.length > 0 ? cmsResults[0].name : data.results[0]?.name;

    return NextResponse.json({
      isWordPress: false,
      isMonolithic: false,
      detectedCms: mainCms || null,
      message: mainCms
        ? `CMS détecté : ${mainCms}`
        : "Technologie détectée mais pas WordPress",
    });
  } catch (err: any) {
    console.error("Erreur detect-cms:", err);
    return NextResponse.json(
      { error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
