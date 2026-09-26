import { describe, expect, it } from "vitest";
import { readOptions } from "./create-client";

const base = ["--email", "DSI@Client.fr", "--nom", "Prénom Nom", "--site", "client.fr"];

describe("sentinelle:client — lecture des paramètres", () => {
  it("normalise l'adresse e-mail et le site", () => {
    const options = readOptions(base);
    expect(options.email).toBe("dsi@client.fr");
    expect(options.siteUrl).toMatch(/^https:\/\/client\.fr/);
  });

  it("scanne par défaut et n'envoie pas la bienvenue sans le demander", () => {
    const options = readOptions(base);
    expect(options.scan).toBe(true);
    expect(options.welcome).toBe(false);
    expect(options.dryRun).toBe(false);
  });

  it("reconnaît les options", () => {
    const options = readOptions([...base, "--sans-scan", "--avec-bienvenue", "--a-blanc", "--entreprise", "Client SAS"]);
    expect(options).toMatchObject({ scan: false, welcome: true, dryRun: true, company: "Client SAS" });
  });

  it("nomme tout ce qui manque d'un coup", () => {
    expect(() => readOptions(["--email", "pas-une-adresse"])).toThrow(/--email[\s\S]*--nom[\s\S]*--site/);
  });
});
