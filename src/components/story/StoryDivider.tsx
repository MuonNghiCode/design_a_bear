interface StoryDividerProps {
  from: string;
  to: string;
  reverse?: boolean;
}

export default function StoryDivider({ from, to, reverse = false }: StoryDividerProps) {
  return (
    <div aria-hidden style={{ backgroundColor: from }}>
      <svg
        viewBox="0 0 1440 140"
        className={`w-full h-[70px] md:h-[92px] ${reverse ? "rotate-180" : ""}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,30 C180,112 410,0 640,40 C860,80 1070,145 1440,48 L1440,140 L0,140 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
