import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BREAKFAST ',
  description: 'ADVENTURE',
  keywords: ['breakfast', 'adventure', 'food', 'exploration'],
  generator: 'v0.dev',
   icons: {
    icon: [
      { url: "/er.png", sizes: "32x32" },
      { url: "/er.png", type: "image/png", sizes: "192x192" },
      { url: "/er.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/er.png", type: "image/png", sizes: "180x180" },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#F59E0B" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);} 
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
