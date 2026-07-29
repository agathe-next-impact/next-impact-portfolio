import { YoutubePlayer } from "@/components/youtube-player";

interface VideoInlineProps {
  url: string;
  title?: string;
  caption?: string;
}

export function VideoInline({ url, title, caption }: VideoInlineProps) {
  const videoTitle = title || "Video";

  return (
    <figure className="my-8">
      <YoutubePlayer url={url} title={videoTitle} />
      {(title || caption) && (
        <figcaption className="mt-3 text-center">
          {title && <p className="text-sm font-googletexte font-medium text-darkblue">{title}</p>}
          {caption && <p className="text-xs font-googletexte text-mediumblue/80 mt-0.5">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}
