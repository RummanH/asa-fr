import { Inter, Manrope } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Al Asatizah",
    template: "%s - Al Asatizah",
  },
  description: "A platform for institutions to find teachers and for teachers to find khidmah opportunities.",
  applicationName: "Al Asatizah",
  keywords: ["teacher", "hiring", "institution", "jobs", "education", "marketplace"],
  authors: [{ name: "Al Asatizah" }],
  creator: "Al Asatizah",
  metadataBase: new URL("https://teacherhiring.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Al Asatizah",
    description: "A platform for institutions to find teachers and for teachers to find khidmah opportunities.",
    siteName: "Al Asatizah",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al Asatizah",
    description: "A platform for institutions to find teachers and for teachers to find khidmah opportunities.",
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
    <html lang="en" className={`${inter.variable} ${manrope.variable} min-h-full antialiased`}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground"
        style={{
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
