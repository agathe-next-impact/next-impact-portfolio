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
  metadataBase: new URL('https://next-impact.digital'),
  title: 'Next Impact - Tout pour lancer son site',
  icons: {
    icon: '/img/logo-small.webp',
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
        {/* Background SVG */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/img/chipset-tech-background.svg"
            alt=""
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
        <Header />
        {children}
        <Footer />
        <MetadataDebugger />
      </body>
    </html>
  )
}
