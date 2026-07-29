"use client";

import Header from '@/components/header'
import './globals.css'
import Footer from '@/components/footer';





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode 
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />    
        <link rel="icon" href="/img/logo-small.png" />
        <title>Next Impact - Tout pour lancer son site</title> 
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Quicksand:wght@300..700&family=Inter:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet"></link>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3D5PKXEN72"
          strategy="afterInteractive"
          async
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
      </head>
      <body>
        <div className="fixed inset-0 z-0">
        <img src="/bg/chipset-tech-background-light.svg" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <Header />   
        {children}
        <Footer />
        </body>
    </html>
  )
}
