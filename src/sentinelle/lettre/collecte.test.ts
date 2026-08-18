import { describe, expect, it } from "vitest";
import { extractJsonObject } from "./collecte";

describe("extractJsonObject", () => {
  it("laisse passer un JSON déjà pur", () => {
    expect(extractJsonObject('{"a":1}')).toBe('{"a":1}');
  });

  it("retire les balises ```json d'une réponse enveloppée", () => {
    const wrapped = 'Voici le dossier :\n```json\n{"a":1,"b":[2,3]}\n```\nFini.';
    expect(JSON.parse(extractJsonObject(wrapped))).toEqual({ a: 1, b: [2, 3] });
  });

  it("récupère l'objet quand un préambule précède le JSON", () => {
    const withPreamble = 'Bien sûr. {"faits": []} ';
    expect(JSON.parse(extractJsonObject(withPreamble))).toEqual({ faits: [] });
  });

  it("rend le texte tel quel s'il n'y a pas d'objet à extraire", () => {
    expect(extractJsonObject("pas de json ici")).toBe("pas de json ici");
  });
});
