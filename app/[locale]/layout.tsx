import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const baseUrl = "https://www.ohrly.com.br";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "Ohrly | Turn ecommerce spreadsheets into better decisions"
    : "Ohrly | Da planilha do e-commerce à próxima decisão";

  const description = isEn
    ? "Turn ecommerce data from spreadsheets, orders, products and customers into clearer operational readings for better decisions."
    : "Transforme dados simples de pedidos, produtos, clientes e canais em uma leitura clara sobre o que merece atenção no seu e-commerce.";

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: title,
      template: "%s | Ohrly",
    },

    description,
    applicationName: "Ohrly",

    keywords: [
      "checklist ecommerce",
      "desempenho ecommerce",
      "planilha de vendas ecommerce",
      "pedidos não concluídos",
      "recompra ecommerce",
      "diagnóstico ecommerce",
      "desempenho loja online",
      "Ohrly",
      "observabilidade comportamental",
    ],

    authors: [{ name: "Ohrly" }],
    creator: "Ohrly",
    publisher: "Ohrly",

    alternates: {
      canonical: `/${locale}`,
      languages: {
        "pt-BR": "/pt",
        "en-US": "/en",
      },
    },

    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: "Ohrly",
      locale: isEn ? "en_US" : "pt_BR",
      type: "website",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: isEn
            ? "Ohrly — Turn ecommerce spreadsheets into better decisions"
            : "Ohrly — Da planilha do e-commerce à próxima decisão",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image.png"],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    category: "technology",

    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale === "en" ? "en-US" : "pt-BR"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider>
          <ThemeProvider>
            {children}
            <Analytics />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
