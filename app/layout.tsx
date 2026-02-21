import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Header from '@/components/header'
import './globals.css'
import Script from "next/script"
import Footer from '@/components/footer'
import Image from 'next/image'
import { MetadataDebugger } from '@/components/metadata-debugger'
import { OrganizationJsonLd } from '@/components/json-ld'
import { ClarityScript } from '@/components/clarity-script'
import { DocumentationModeProvider } from '@/contexts/documentation-mode-context'
import { HomepageProfileBanner } from '@/components/homepage-profile-banner'

const inter = localFont({
  src: [
    {
      path: '../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
})

const nunito = localFont({
  src: [
    {
      path: '../public/fonts/Nunito-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Nunito-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Nunito-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.next-impact.digital'),
  title: {
    default: 'Next Impact — Experte WordPress Headless & Next.js',
    template: '%s | Next Impact',
  },
  description:
    'Solutions WordPress Headless avec Next.js et Astro. ' +
    'Création, refonte, audit et conseil par une développeuse freelance.',
  keywords: [
    'WordPress Headless',
    'Next.js',
    'Astro',
    'développeuse freelance',
    'création site web',
    'refonte site web',
    'CMS Headless',
    'React',
    'TypeScript',
  ],
  authors: [{ name: 'Agathe Karinthi-Martin', url: 'https://www.next-impact.digital' }],
  creator: 'Agathe Karinthi-Martin',
  publisher: 'Next Impact',
  icons: {
    icon: '/img/logo-small.webp',
    apple: '/img/logo-small.webp',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Next Impact',
    title: 'Next Impact — Experte WordPress Headless & Next.js',
    description:
      'Développeuse freelance spécialisée WordPress Headless. ' +
      'Création, refonte et audit de sites ultra-performants.',
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
    title: 'Next Impact — Experte WordPress Headless & Next.js',
    description:
      'Développeuse freelance spécialisée WordPress Headless + Next.js.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode 
}>) {
  return (
    <html lang="fr" className={`scroll-smooth ${inter.variable} ${nunito.variable}`}>
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
        {/* Background SVG – fixed on all devices */}
        <div className="fixed inset-0 z-0 will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
          <Image
            src="/img/chipset-tech-background.svg"
            alt=""
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
        <DocumentationModeProvider>
          <Header />
          <HomepageProfileBanner />
          {children}
          <Footer />
          <MetadataDebugger />
        </DocumentationModeProvider>
      </body>
    </html>
  )
}
