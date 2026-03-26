interface ConnectPhraseRevealProps {
  text: string;
  className?: string;
}

function splitIntoPhrases(text: string): string[] {
  const matches = text.match(/[^,.;!?]+[,.;!?]?/g);
  if (!matches) return [text];
  return matches.map((part) => part.trim()).filter(Boolean);
}

export default function ConnectPhraseReveal({
  text,
  className,
}: ConnectPhraseRevealProps) {
  const phrases = splitIntoPhrases(text);

  return (
    <span className={`connect-phrase-group inline-block ${className ?? ""}`}>
      {phrases.map((phrase, idx) => (
        <span
          key={`${phrase}-${idx}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: idx === phrases.length - 1 ? 0 : "0.3em" }}
        >
          <span className="connect-phrase inline-block">{phrase}</span>
        </span>
      ))}
    </span>
  );
}
