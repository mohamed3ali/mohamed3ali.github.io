import '../styles/globals.css';
import Head from 'next/head';
import { TranslationProvider } from '../translations';

export default function App({ Component, pageProps }) {
  return (
    <TranslationProvider>
      <Head>
        <title>ToolsHub - Powerful Online Tools For Every Task</title>
        <meta name="description" content="Free, fast, and easy-to-use online tools for developers, designers, and content creators. JSON formatter, image compressor, PDF tools and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* SEO */}
        <meta property="og:title" content="ToolsHub - Powerful Online Tools" />
        <meta property="og:description" content="Free online tools for developers and creators" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#0ea5e9" />
      </Head>
      
      <Component {...pageProps} />
    </TranslationProvider>
  );
}
