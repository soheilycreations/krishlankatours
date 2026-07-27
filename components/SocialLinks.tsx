import { SITE } from "@/lib/site-config";

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8.5v3H11v7h2.5z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.2V8.8L15.6 12 10 15.2z" />
    </svg>
  );
}

/** Tripadvisor owl mark (simplified, single-color). */
function TripadvisorIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 6.6c-2.1 0-4 .5-5.7 1.4H2.6l1.7 1.9a5.2 5.2 0 1 0 7.7 7l-.1.1 1.4-2.1 1.4 2.1a5.2 5.2 0 1 0 7.6-7.1l1.7-1.9h-3.7A12.4 12.4 0 0 0 12 6.6zm-4.6 12a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm9.2 0a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zM12 8.3c1.3 0 2.6.2 3.8.7a5.2 5.2 0 0 0-3.8 3.6 5.2 5.2 0 0 0-3.8-3.6c1.2-.5 2.5-.7 3.8-.7zM7.4 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm9.2 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>
  );
}

const LINKS = [
  { label: "TripAdvisor", href: SITE.tripadvisor, Icon: TripadvisorIcon, hover: "hover:bg-[#00AA6C] hover:border-[#00AA6C]" },
  { label: "Facebook", href: SITE.facebook, Icon: FacebookIcon, hover: "hover:bg-[#1877F2] hover:border-[#1877F2]" },
  { label: "Instagram", href: SITE.instagram, Icon: InstagramIcon, hover: "hover:bg-[#E4405F] hover:border-[#E4405F]" },
  { label: "YouTube", href: SITE.youtube, Icon: YoutubeIcon, hover: "hover:bg-[#FF0000] hover:border-[#FF0000]" },
];

/** Round social buttons. `tone="dark"` for the footer, default for light cards. */
export default function SocialLinks({ tone = "light" }: { tone?: "light" | "dark" }) {
  const base =
    tone === "dark"
      ? "border-white/20 text-white/80 hover:text-white"
      : "border-navy/15 text-navy/70 hover:text-white";
  return (
    <div className="flex flex-wrap gap-2.5">
      {LINKS.map(({ label, href, Icon, hover }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${base} ${hover}`}
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  );
}
