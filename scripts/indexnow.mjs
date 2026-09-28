// Soumet les URL du sitemap de production à IndexNow (Bing, Yandex, Seznam…).
// La clé est le fichier public/<clé>.txt, qui doit être déployé et servi à la
// racine du domaine avant tout envoi : IndexNow le vérifie.
//
// Usage : node scripts/indexnow.mjs            (tout le sitemap)
//         node scripts/indexnow.mjs /scan /tarifs   (quelques chemins)
import { readdirSync } from "node:fs";

const HOST = "www.next-impact.digital";
const ORIGIN = `https://${HOST}`;

const keyFile = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("Clé IndexNow introuvable dans public/.");
const key = keyFile.replace(/\.txt$/, "");
const keyLocation = `${ORIGIN}/${keyFile}`;

const served = await fetch(keyLocation);
if (!served.ok || (await served.text()).trim() !== key) {
  console.error(`La clé n'est pas servie sur ${keyLocation} : déployez d'abord.`);
  process.exit(1);
}

let urlList = process.argv.slice(2).map((p) => new URL(p, ORIGIN).href);
if (urlList.length === 0) {
  const sitemap = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
});
console.log(`IndexNow : ${res.status} ${res.statusText} pour ${urlList.length} URL.`);
if (res.status >= 300) console.log(await res.text());
