import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Meta Tags */}
        <meta name="description" content="Toolvy - All your tools, one place. Free online tools for developers, designers, and content creators." />
        <meta name="theme-color" content="#7c6cfa" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
