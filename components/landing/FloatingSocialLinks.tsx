import type { SVGProps } from "react";

type BrandIconProps = SVGProps<SVGSVGElement>;

function FacebookIcon(props: BrandIconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" {...props}>
      <path
        d="M24 12.073C24 5.405 18.627.003 12 .003S0 5.405 0 12.073c0 6.018 4.388 11.006 10.125 11.91v-8.429H7.078v-3.48h3.047V9.421c0-3.019 1.792-4.688 4.533-4.688 1.312 0 2.686.235 2.686.235v2.96h-1.513c-1.49 0-1.956.928-1.956 1.88v2.265h3.328l-.532 3.48h-2.796v8.429C19.612 23.079 24 18.091 24 12.073z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon(props: BrandIconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon(props: BrandIconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" {...props}>
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.267 2.371 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        fill="currentColor"
      />
    </svg>
  );
}

function YouTubeIcon(props: BrandIconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" {...props}>
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        fill="currentColor"
      />
    </svg>
  );
}

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/", color: "#1877f2", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/", color: "#e4405f", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/", color: "#0a66c2", Icon: LinkedInIcon },
  { label: "YouTube", href: "https://www.youtube.com/", color: "#ff0000", Icon: YouTubeIcon },
] as const;

export function FloatingSocialLinks() {
  return (
    <aside
      aria-label="Social media links"
      className="fixed right-3 top-1/2 z-50 -translate-y-1/2 sm:right-5"
    >
      <nav className="landing-radius flex flex-col gap-2 border border-brand-navy/10 bg-white/88 p-1.5 shadow-[0_18px_48px_rgba(7,17,31,0.16)] backdrop-blur-xl">
        {socialLinks.map(({ href, label, color, Icon }) => (
          <a
            aria-label={label}
            className="landing-radius flex h-10 w-10 items-center justify-center text-white shadow-[0_10px_24px_rgba(7,17,31,0.16)] transition hover:-translate-x-1 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-brand-sky/70 sm:h-11 sm:w-11"
            href={href}
            key={label}
            rel="noreferrer"
            style={{ backgroundColor: color }}
            target="_blank"
            title={label}
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </nav>
    </aside>
  );
}
