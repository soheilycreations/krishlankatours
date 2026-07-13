export default function CornerMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* large sweeping wave, single organic curve */}
        <path
          d="M10 300 Q 90 260, 150 300 T 290 290 Q 340 285, 400 240"
          strokeWidth="3"
          opacity="0.5"
        />
        <path
          d="M30 340 Q 110 305, 170 335 T 310 320"
          strokeWidth="2.5"
          opacity="0.35"
        />

        {/* palm frond cluster */}
        <g strokeWidth="2.5" opacity="0.55">
          <path d="M340 60 Q 300 20, 250 30" />
          <path d="M340 60 Q 310 35, 275 55" />
          <path d="M340 60 Q 320 90, 290 100" />
          <path d="M340 60 Q 300 70, 270 95" />
          <path d="M340 60 L 340 130" />
        </g>

        {/* sun burst */}
        <g strokeWidth="2" opacity="0.45">
          <circle cx="120" cy="110" r="24" />
          <path d="M120 76 V86" />
          <path d="M120 134 V144" />
          <path d="M86 110 H96" />
          <path d="M144 110 H154" />
          <path d="M96.6 86.6 L103.7 93.7" />
          <path d="M136.3 126.3 L143.4 133.4" />
          <path d="M96.6 133.4 L103.7 126.3" />
          <path d="M136.3 93.7 L143.4 86.6" />
        </g>

        {/* small scattered dots for texture */}
        <circle cx="220" cy="70" r="2.5" opacity="0.4" fill="currentColor" stroke="none" />
        <circle cx="245" cy="150" r="2" opacity="0.35" fill="currentColor" stroke="none" />
        <circle cx="60" cy="200" r="2.5" opacity="0.35" fill="currentColor" stroke="none" />
        <circle cx="380" cy="180" r="2" opacity="0.4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
