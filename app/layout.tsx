import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Teacher Hiring Platform",
    template: "%s · Teacher Hiring Platform",
  },
  description: "The modern marketplace connecting great teachers with great institutions.",
  applicationName: "Teacher Hiring Platform",
  keywords: ["teacher", "hiring", "institution", "jobs", "education", "marketplace"],
  authors: [{ name: "Teacher Hiring Platform" }],
  creator: "Teacher Hiring Platform",
  metadataBase: new URL("https://teacherhiring.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Teacher Hiring Platform",
    description: "The modern marketplace connecting great teachers with great institutions.",
    siteName: "Teacher Hiring Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teacher Hiring Platform",
    description: "The modern marketplace connecting great teachers with great institutions.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#052f44",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${GeistSans.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground"
        style={{
          fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
          WebkitTapHighlightColor: "transparent",
          overscrollBehavior: "none",
        }}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}