import Head from 'next/head';
import { getSeoData } from '../data/seoMetadata';

export default function SEOHead({ toolSlug, customData = {} }) {
  // Get SEO data from metadata file or use custom data
  const seoData = toolSlug ? getSeoData(toolSlug) : null;
  
  // Merge with custom data (custom data takes priority)
  const data = { ...seoData, ...customData };
  
  // Default values if no data is found
  const {
    title = 'Toolvy - Free Online Tools',
    metaDescription = 'Free online tools for developers, designers, and content creators. Fast, secure, and easy to use.',
    keywords = [],
    ogTitle = title,
    ogDescription = metaDescription,
    twitterTitle = title,
    twitterDescription = metaDescription,
    slug = '',
  } = data;

  const siteUrl = 'https://toolvy.io'; // Update with your actual domain
  const canonicalUrl = slug ? `${siteUrl}/tools/${slug}` : siteUrl;
  const ogImage = `${siteUrl}/og-image.png`; // Update with your actual OG image path

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Toolvy" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={twitterTitle} />
      <meta property="twitter:description" content={twitterDescription} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Toolvy" />

      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: ogTitle,
            description: ogDescription,
            url: canonicalUrl,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1250',
            },
          }),
        }}
      />
    </Head>
  );
}
