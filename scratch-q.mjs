import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(".env.local","utf8").split(/\r?\n/).filter(l=>/^[A-Z_]+=/.test(l)).map(l=>{const i=l.indexOf("=");return [l.slice(0,i),l.slice(i+1).replace(/^"|"$/g,"")]}));
const sql = neon(env.DATABASE_URL);
const c = await sql`select id, name from cto_clients where name ilike '%lean%'`;
console.log(c);
for (const x of c) console.log(await sql`select id, kind, title, notion_page_id, occurred_at, created_at, retracted_at from cto_deliverables where client_id=${x.id} and kind in ('audit','proposition') order by created_at`);
