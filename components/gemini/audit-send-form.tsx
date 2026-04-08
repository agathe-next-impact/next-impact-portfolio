interface AuditSendFormProps {
  markdownFull: string;
  url: string;
}

export default function AuditSendForm({ markdownFull, url }: AuditSendFormProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 p-6 bg-extralightblue/90 rounded-2xl mt-8">
      <span className="w-max px-4 py-1 bg-coral rounded-full text-white font-googletitre text-xl">{url}</span>
      <div className="prose prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: marked.parse(markdownFull) }} />
    </div>
  );
}
