'use client';

import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ToolCard from '../../components/ToolCard';
import { useTranslation } from '../../translations';

export default function AllToolsPage() {
  const { t } = useTranslation();

  // All tools organized by category
  const allTools = {
    developer: [
      {
        name: t('tools.jsonFormatter'),
        description: t('descriptions.jsonFormatter'),
        icon: '{ }',
        href: '/tools/json-formatter',
        category: t('categories.developer'),
        popular: true,
      },
      {
        name: t('tools.base64Encoder'),
        description: t('descriptions.base64Encoder'),
        icon: '🔐',
        href: '/tools/base64-encoder',
        category: t('categories.developer'),
      },
      {
        name: t('tools.urlEncoder'),
        description: t('descriptions.urlEncoder'),
        icon: '🔗',
        href: '/tools/url-encoder',
        category: t('categories.developer'),
      },
      {
        name: t('tools.jwtDecoder'),
        description: t('descriptions.jwtDecoder'),
        icon: '🎫',
        href: '/tools/jwt-decoder',
        category: t('categories.developer'),
      },
      {
        name: t('tools.uuidGenerator'),
        description: t('descriptions.uuidGenerator'),
        icon: '🆔',
        href: '/tools/uuid-generator',
        category: t('categories.developer'),
      },
      {
        name: t('tools.hashGenerator'),
        description: t('descriptions.hashGenerator'),
        icon: '#️⃣',
        href: '/tools/hash-generator',
        category: t('categories.developer'),
      },
      {
        name: t('tools.passwordGenerator'),
        description: t('descriptions.passwordGenerator'),
        icon: '🔑',
        href: '/tools/password-generator',
        category: t('categories.developer'),
        popular: true,
      },
    ],
    pdf: [
      {
        name: t('tools.pdfMerger'),
        description: t('descriptions.pdfMerger'),
        icon: '📑',
        href: '/tools/pdf-merger',
        category: t('categories.pdf'),
        popular: true,
      },
      {
        name: t('tools.pdfSplitter'),
        description: t('descriptions.pdfSplitter'),
        icon: '✂️',
        href: '/tools/pdf-splitter',
        category: t('categories.pdf'),
      },
      {
        name: t('tools.pdfCompressor'),
        description: t('descriptions.pdfCompressor'),
        icon: '🗜️',
        href: '/tools/pdf-compressor',
        category: t('categories.pdf'),
        popular: true,
      },
      {
        name: t('tools.pdfToWord'),
        description: t('descriptions.pdfToWord'),
        icon: '📝',
        href: '/tools/pdf-to-word',
        category: t('categories.pdf'),
        popular: true,
      },
      {
        name: t('tools.wordToPdf'),
        description: t('descriptions.wordToPdf'),
        icon: '📄',
        href: '/tools/word-to-pdf',
        category: t('categories.pdf'),
      },
      {
        name: t('tools.pdfToExcel'),
        description: t('descriptions.pdfToExcel'),
        icon: '📊',
        href: '/tools/pdf-to-excel',
        category: t('categories.pdf'),
      },
      {
        name: t('tools.excelToPdf'),
        description: t('descriptions.excelToPdf'),
        icon: '📄',
        href: '/tools/excel-to-pdf',
        category: t('categories.pdf'),
      },
      {
        name: t('tools.pdfToImages'),
        description: t('descriptions.pdfToImages'),
        icon: '🖼️',
        href: '/tools/pdf-to-images',
        category: t('categories.pdf'),
      },
      {
        name: t('tools.imagesToPdf'),
        description: t('descriptions.imagesToPdf'),
        icon: '📸',
        href: '/tools/images-to-pdf',
        category: t('categories.pdf'),
      },
      {
        name: t('tools.pdfToText'),
        description: t('descriptions.pdfToText'),
        icon: '📃',
        href: '/tools/pdf-to-text',
        category: t('categories.pdf'),
      },
      {
        name: t('tools.rotatePdf'),
        description: t('descriptions.rotatePdf'),
        icon: '🔄',
        href: '/tools/rotate-pdf',
        category: t('categories.pdf'),
      },
      {
        name: t('tools.pdfWatermark'),
        description: t('descriptions.pdfWatermark'),
        icon: '💧',
        href: '/tools/pdf-watermark',
        category: t('categories.pdf'),
      },
      {
        name: t('tools.removePdfPages'),
        description: t('descriptions.removePdfPages'),
        icon: '🗑️',
        href: '/tools/remove-pdf-pages',
        category: t('categories.pdf'),
      },
      {
        name: t('tools.addPageNumbers'),
        description: t('descriptions.addPageNumbers'),
        icon: '🔢',
        href: '/tools/add-page-numbers',
        category: t('categories.pdf'),
      },
    ],
    image: [
      {
        name: t('tools.imageResizer'),
        description: t('descriptions.imageResizer'),
        icon: '📐',
        href: '/tools/image-resizer',
        category: t('categories.image'),
        popular: true,
      },
      {
        name: t('tools.imageConverter'),
        description: t('descriptions.imageConverter'),
        icon: '🔄',
        href: '/tools/image-converter',
        category: t('categories.image'),
      },
      {
        name: t('tools.imageCompressor'),
        description: t('descriptions.imageCompressor'),
        icon: '🗜️',
        href: '/tools/image-compressor',
        category: t('categories.image'),
        popular: true,
      },
    ],
    text: [
      {
        name: t('tools.caseConverter'),
        description: t('descriptions.caseConverter'),
        icon: '🔤',
        href: '/tools/case-converter',
        category: t('categories.text'),
        popular: true,
      },
      {
        name: t('tools.wordCounter'),
        description: t('descriptions.wordCounter'),
        icon: '📊',
        href: '/tools/word-counter',
        category: t('categories.text'),
        popular: true,
      },
      {
        name: t('tools.textReverser'),
        description: t('descriptions.textReverser'),
        icon: '↔️',
        href: '/tools/text-reverser',
        category: t('categories.text'),
      },
      {
        name: t('tools.slugGenerator'),
        description: t('descriptions.slugGenerator'),
        icon: '🔗',
        href: '/tools/slug-generator',
        category: t('categories.text'),
      },
      {
        name: t('tools.textDiff'),
        description: t('descriptions.textDiff'),
        icon: '🔍',
        href: '/tools/text-diff',
        category: t('categories.text'),
      },
    ],
    web: [
      {
        name: t('tools.htmlMinifier'),
        description: t('descriptions.htmlMinifier'),
        icon: '📄',
        href: '/tools/html-minifier',
        category: t('categories.web'),
        popular: true,
      },
      {
        name: t('tools.cssMinifier'),
        description: t('descriptions.cssMinifier'),
        icon: '🎨',
        href: '/tools/css-minifier',
        category: t('categories.web'),
      },
      {
        name: t('tools.jsMinifier'),
        description: t('descriptions.jsMinifier'),
        icon: '⚡',
        href: '/tools/js-minifier',
        category: t('categories.web'),
        popular: true,
      },
      {
        name: t('tools.markdownConverter'),
        description: t('descriptions.markdownConverter'),
        icon: '📝',
        href: '/tools/markdown-converter',
        category: t('categories.web'),
      },
      {
        name: t('tools.qrGenerator'),
        description: t('descriptions.qrGenerator'),
        icon: '📱',
        href: '/tools/qr-generator',
        category: t('categories.web'),
      },
    ],
  };

  // Flatten all tools into a single array
  const toolsList = Object.values(allTools).flat();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl text-5xl mb-6">
                🛠️
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">
                {t('home.categories.title') || 'All Tools'}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {t('home.categories.subtitle') || 'Browse our complete collection of free online tools'}
              </p>
              
              {/* Breadcrumb */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                <a href="/" className="hover:text-blue-500 transition-colors">{t('header.home')}</a>
                <span>/</span>
                <span className="text-gray-700 dark:text-gray-300">{t('common.tools') || 'All Tools'}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
          <div className="section-container">
            {/* Stats Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {t('common.all') || 'All'} {t('common.tools') || 'Tools'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {toolsList.length} {toolsList.length === 1 ? (t('common.tool') || 'tool') : (t('common.tools') || 'tools')} {t('common.available') || 'available'}
                </p>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolsList.map((tool, index) => (
                <ToolCard key={tool.name} tool={tool} index={index} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
