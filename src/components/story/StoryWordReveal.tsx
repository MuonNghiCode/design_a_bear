interface StoryWordRevealProps {
  text: string;
  className?: string;
  phraseClassName?: string;
}

function splitByPhrase(text: string): string[] {
  const parts = text.match(/[^,.;!?]+[,.;!?]?/g);
  if (!parts) return [text];
  return parts.map((part) => part.trim()).filter(Boolean);
}

export default function StoryWordReveal({
  text,
  className,
  phraseClassName,
}: StoryWordRevealProps) {
  const phrases = splitByPhrase(text);

  return (
    <span className={`story-phrase-group inline-block ${className ?? ""}`}>
      {phrases.map((phrase, idx) => (
        <span
          key={`${phrase}-${idx}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: idx === phrases.length - 1 ? 0 : "0.32em" }}
        >
          <span
            className={`story-phrase inline-block ${phraseClassName ?? ""}`}
          >
            {phrase}
          </span>
        </span>
      ))}
    </span>
  );
}
