import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google'
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
import { routing } from '@/i18n/routing'

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const geist = Geist({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.next-impact.digital'),
  title: {
    default: 'Next Impact — Sites web & applications clé en main, PME & ESS',
    template: '%s | Next Impact',
  },
  description:
    'Studio indépendant spécialisé dans les sites web et applications performants, pour les PME et structures de l\'ESS. ' +
    'Vous gérez votre activité, je gère la technique : sites clé en main, délai et budget fixés dès le départ.',
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
  authors: [{ name: 'Agathe Karinthi-Martin', url: 'https://www.next-impact.digital' }],
  creator: 'Agathe Karinthi-Martin',
  publisher: 'Next Impact',
  icons: {
    icon: '/img/logo-rouge-noir-carre-icon.png',
    apple: '/img/logo-rouge-noir-carre-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Next Impact',
    title: 'Next Impact — Sites web & applications clé en main',
    description:
      'Studio indépendant pour PME et ESS : sites web et applications performants, ' +
      'clé en main, délai et budget fixés dès le départ.',
    url: 'https://www.next-impact.digital',
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
    title: 'Next Impact — Sites web & applications clé en main',
    description:
      'Studio indépendant pour PME et ESS : sites web et applications performants, clé en main.',
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
    canonical: '/',
    languages: {
      'fr-FR': '/',
    },
  },
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
      className={`scroll-smooth ${instrumentSerif.variable} ${geist.variable} ${geistMono.variable}`}
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
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="theme-v2" themes={['light', 'dark']} disableTransitionOnChange>
            <DocumentationModeProvider>
              <Header />
              {children}
              <Footer />
              <FloatingContact />
              <MetadataDebugger />
            </DocumentationModeProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
