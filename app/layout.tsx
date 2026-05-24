import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Teacher Hiring Platform",
    template: "%s - Teacher Hiring Platform",
  },
  description: "A premium education hiring marketplace for teachers and institutions.",
  applicationName: "Teacher Hiring Platform",
  keywords: ["teacher", "hiring", "institution", "jobs", "education", "marketplace"],
  authors: [{ name: "Teacher Hiring Platform" }],
  creator: "Teacher Hiring Platform",
  metadataBase: new URL("https://teacherhiring.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Teacher Hiring Platform",
    description: "A premium education hiring marketplace for teachers and institutions.",
    siteName: "Teacher Hiring Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teacher Hiring Platform",
    description: "A premium education hiring marketplace for teachers and institutions.",
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
  themeColor: "#07111f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="min-h-full antialiased">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
