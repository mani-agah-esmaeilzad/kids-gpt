export function Mascot({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#g)" />
      <circle cx="70" cy="90" r="14" fill="#fff" />
      <circle cx="130" cy="90" r="14" fill="#fff" />
      <circle cx="70" cy="92" r="6" fill="#1f2937" />
      <circle cx="130" cy="92" r="6" fill="#1f2937" />
      <path
        d="M70 125c12 12 48 12 60 0"
        stroke="#1f2937"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
