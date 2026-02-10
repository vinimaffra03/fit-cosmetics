import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FIT Cosmetics - Cosméticos Profissionais",
    template: "%s | FIT Cosmetics",
  },
  description:
    "FIT Cosmetics - Seu e-commerce de cosméticos profissionais. Progressivas, kits completos e produtos de manutenção capilar.",
  keywords: [
    "cosméticos",
    "progressiva",
    "cabelo",
    "tratamento capilar",
    "FIT Cosmetics",
    "alisamento",
    "profissional",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "FIT Cosmetics",
    title: "FIT Cosmetics - Cosméticos Profissionais",
    description:
      "Seu e-commerce de cosméticos profissionais. Progressivas, kits completos e produtos de manutenção capilar.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${cormorant.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
