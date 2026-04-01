interface ConnectDividerProps {
  from: string;
  to: string;
  reverse?: boolean;
}

export default function ConnectDivider({
  from,
  to,
  reverse = false,
}: ConnectDividerProps) {
  return (
    <div aria-hidden className="leading-none" style={{ backgroundColor: from }}>
      <svg
        viewBox="0 0 1440 120"
        className={`block w-full h-15.5 md:h-21 ${reverse ? "rotate-180" : ""}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,20 C170,92 380,10 610,40 C850,72 1070,122 1440,42 L1440,120 L0,120 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
