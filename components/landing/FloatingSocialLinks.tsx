const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/", mark: "f" },
  { label: "Instagram", href: "https://www.instagram.com/", mark: "ig" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", mark: "in" },
  { label: "YouTube", href: "https://www.youtube.com/", mark: "yt" },
] as const;

export function FloatingSocialLinks() {
  return (
    <aside
      aria-label="Social media links"
      className="fixed right-3 top-1/2 z-50 -translate-y-1/2 sm:right-5"
    >
      <nav className="landing-radius flex flex-col gap-2 border border-brand-navy/10 bg-white/88 p-1.5 shadow-[0_18px_48px_rgba(7,17,31,0.16)] backdrop-blur-xl">
        {socialLinks.map(({ href, label, mark }) => (
          <a
            aria-label={label}
            className="landing-radius flex h-10 w-10 items-center justify-center bg-brand-navy text-[11px] font-black uppercase leading-none text-white transition hover:-translate-x-1 hover:bg-brand-teal hover:shadow-[0_12px_28px_rgba(11,143,136,0.28)] focus:outline-none focus:ring-4 focus:ring-brand-sky/70 sm:h-11 sm:w-11"
            href={href}
            key={label}
            rel="noreferrer"
            target="_blank"
            title={label}
          >
            {mark}
          </a>
        ))}
      </nav>
    </aside>
  );
}
