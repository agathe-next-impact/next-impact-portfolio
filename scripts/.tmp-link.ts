import "./load-env";
import { findPersonsByEmail, issueMagicLink } from "../src/cto/access";
async function main() {
  const [person] = await findPersonsByEmail(process.argv[2]);
  if (!person) throw new Error("personne introuvable");
  const issued = await issueMagicLink(person.id);
  if (!issued.ok) throw new Error("trop de liens");
  console.log("TOKEN=" + encodeURIComponent(issued.token));
}
main().catch((e) => { console.error("ERR", e.message); });
