import { YoutubePlayer } from "@/components/youtube-player";

interface VideoEmbedProps {
  url: string;
  title: string;
  className?: string;
  compact?: boolean;
}

export function VideoEmbed({ url, title, className, compact = false }: VideoEmbedProps) {
  return <YoutubePlayer url={url} title={title} className={className} compact={compact} />;
}

interface VideoCardProps {
  url: string;
  title: string;
  description?: string;
  projectLink?: string;
  className?: string;
}

export function VideoCard({ url, title, description, projectLink, className }: VideoCardProps) {
  return (
    <div
      className={className}
      style={{ border: "1px solid var(--rule)", background: "var(--paper)", overflow: "hidden" }}
    >
      <VideoEmbed url={url} title={title} />
      <div style={{ padding: "1rem 1.25rem" }}>
        <h4
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.9375rem",
            fontWeight: 400,
            color: "var(--ink)",
            marginBottom: "0.25rem",
          }}
        >
          {title}
        </h4>
        {description && (
          <p style={{ fontSize: "0.75rem", color: "var(--muted-color)", lineHeight: 1.5 }}>
            {description}
          </p>
        )}
        {projectLink && (
          <a
            href={projectLink}
            style={{
              display: "inline-block",
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--accent-color)",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
            }}
          >
            Voir le projet &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
