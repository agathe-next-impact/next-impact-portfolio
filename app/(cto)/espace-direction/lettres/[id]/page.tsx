import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { letterForClient } from "@cto/letters";
import { BackLink, Label, PageHeader } from "../../ui";
import { CorpsLettre, formatPeriode, LETTRES_PATH } from "../../lettre";
import { requireSession } from "../../session";

export const metadata: Metadata = {
  title: "Lettre de veille",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * La lecture d'une lettre.
 *
 * `letterForClient` porte les trois contrôles — publiée, dans la fenêtre, et
 * visible par CET accompagnement — dans sa requête. La page ne les refait pas :
 * un contrôle dupliqué est un contrôle qui divergera.
 */
export default async function LettrePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  const lettre = await letterForClient(id, session.person.clientId);
  if (!lettre) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="mb-8">
        <BackLink href={LETTRES_PATH}>Votre veille</BackLink>
      </div>

      <PageHeader company={session.person.company} title={lettre.title}>
        <Label>{formatPeriode(lettre.period)}</Label>
      </PageHeader>

      {lettre.chapo ? (
        <p className="mt-8 max-w-[68ch] border-l-2 border-l-accent-secondary pl-4 font-inter-tight text-base leading-relaxed text-foreground">
          {lettre.chapo}
        </p>
      ) : null}

      <article className="mt-4">
        <CorpsLettre body={lettre.body} />
      </article>
    </main>
  );
}
