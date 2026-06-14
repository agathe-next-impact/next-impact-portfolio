import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Figtree, Inter_Tight, Geist_Mono } from 'next/font/google'
import Header from '@/components/header'
import '../globals.css'
import Script from "next/script"
import Footer from '@/components/footer'
import { MetadataDebugger } from '@/components/metadata-debugger'
import { OrganizationJsonLd } from '@/components/json-ld'
import { ClarityScript } from '@/components/clarity-script'
import { DocumentationModeProvider } from '@/contexts/documentation-mode-context'
import { FloatingContact } from '@/components/floating-contact'
import { ThemeProvider } from '@/components/theme-provider'
import { MotionProvider } from '@/components/motion-provider'
import { routing } from '@/i18n/routing'

// Typographie « Blueprint / aspect » : Figtree (titres + UI + corps par défaut),
// Inter Tight (paragraphes de contenu via .font-inter-tight), Geist Mono (labels).
const figtree = Figtree({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const interTight = Inter_Tight({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const geistMono = Geist_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const SITE_URL = 'https://www.next-impact.digital'

// Valeurs par défaut (fallback) du site, déclinées par locale.
// Chaque page surcharge ces métadonnées via generatePageMetadata ;
// ce bloc sert de repli cohérent pour toute page qui ne le ferait pas.
const LAYOUT_META = {
  fr: {
    title: 'Next Impact — Sites web & applications clé en main, PME & ESS',
    description:
      'Studio indépendant spécialisé dans les sites web et applications performants, pour les PME et structures de l\'ESS. ' +
      'Vous gérez votre activité, je gère la technique : sites clé en main, délai et budget fixés dès le départ.',
    ogTitle: 'Next Impact — Sites web & applications clé en main',
    ogDescription:
      'Studio indépendant pour PME et ESS : sites web et applications performants, ' +
      'clé en main, délai et budget fixés dès le départ.',
    ogLocale: 'fr_FR',
    altOgLocale: 'en_US',
  },
  en: {
    title: 'Next Impact — Turnkey websites & applications for SMEs & social economy',
    description:
      'Independent studio specialising in fast, durable websites and applications for SMEs and social-economy organisations. ' +
      'You run your business, I handle the tech: fixed timeline and budget.',
    ogTitle: 'Next Impact — Turnkey websites & applications',
    ogDescription:
      'Independent studio for SMEs and social-economy organisations: fast, durable websites and applications, turnkey.',
    ogLocale: 'en_US',
    altOgLocale: 'fr_FR',
  },
} as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  const m = isEn ? LAYOUT_META.en : LAYOUT_META.fr
  const canonical = isEn ? '/en' : '/'
  const ogUrl = isEn ? `${SITE_URL}/en` : SITE_URL

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: m.title,
      template: '%s | Next Impact',
    },
    description: m.description,
    keywords: [
      'création site web',
      'WordPress Headless',
      'Next.js',
      'web app sur-mesure',
      'application mobile',
      'PWA',
      'marketplace',
      'studio indépendant',
      'refonte site web',
      'CMS Headless',
      'React',
      'TypeScript',
    ],
    authors: [{ name: 'Agathe Karinthi-Martin', url: SITE_URL }],
    creator: 'Agathe Karinthi-Martin',
    publisher: 'Next Impact',
    icons: {
      icon: '/img/logo-rouge-noir-carre-icon.png',
      apple: '/img/logo-rouge-noir-carre-icon.png',
    },
    openGraph: {
      type: 'website',
      locale: m.ogLocale,
      alternateLocale: [m.altOgLocale],
      siteName: 'Next Impact',
      title: m.ogTitle,
      description: m.ogDescription,
      url: ogUrl,
      images: [
        {
          url: '/img/desktop-screen-next-impact.png',
          width: 1200,
          height: 630,
          alt: 'Next Impact — WordPress Headless & Next.js',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.ogTitle,
      description: m.ogDescription,
      images: [
        {
          url: '/img/desktop-screen-next-impact.png',
          alt: 'Next Impact — WordPress Headless & Next.js',
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical,
      languages: {
        'fr-FR': '/',
        'en-US': '/en',
        'x-default': '/',
      },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`scroll-smooth ${figtree.variable} ${interTight.variable} ${geistMono.variable}`}
    >
      <body>
        <OrganizationJsonLd />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3D5PKXEN72"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3D5PKXEN72');
            `,
          }}
        />
        <ClarityScript />
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme-v2" themes={['light', 'dark']} disableTransitionOnChange>
            <DocumentationModeProvider>
              <MotionProvider>
                <Header />
                {children}
                <Footer />
                <FloatingContact />
                <MetadataDebugger />
              </MotionProvider>
            </DocumentationModeProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
