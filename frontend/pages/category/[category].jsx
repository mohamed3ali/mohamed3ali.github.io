'use client';

import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ToolCard from '../../components/ToolCard';
import { useTranslation } from '../../translations';

export default function CategoryPage() {
  const router = useRouter();
  const { category: categorySlug } = router.query;
  const { t } = useTranslation();

  // Category data configuration - using translations
  const getCategoriesData = () => ({
    developer: {
      name: t('categories.developer'),
      description: t('descriptions.developerCategory') || 'Essential tools for developers to write, test, and optimize code',
      icon: '💻',
      tools: [
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
        {
          name: t('tools.qrGenerator'),
          description: t('descriptions.qrGenerator'),
          icon: '📱',
          href: '/tools/qr-generator',
          category: t('categories.developer'),
        },
        {
          name: t('tools.imageCompressor'),
          description: t('descriptions.imageCompressor'),
          icon: '🗜️',
          href: '/tools/image-compressor',
          category: t('categories.developer'),
        },
      ],
    },
    pdf: {
      name: t('categories.pdf'),
      description: t('descriptions.pdfCategory') || 'Convert, merge, split, compress, and manipulate PDF documents',
      icon: '📄',
      tools: [
        {
          name: t('tools.pdfMerger'),
          description: t('descriptions.pdfMerger') || 'Merge multiple PDF files into one document',
          icon: '📑',
          href: '/tools/pdf-merger',
          category: t('categories.pdf'),
          popular: true,
        },
        {
          name: t('tools.pdfSplitter'),
          description: t('descriptions.pdfSplitter') || 'Split PDF files by page ranges',
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
          description: t('descriptions.pdfToExcel') || 'Convert PDF tables to Excel spreadsheets',
          icon: '📊',
          href: '/tools/pdf-to-excel',
          category: t('categories.pdf'),
        },
        {
          name: t('tools.excelToPdf'),
          description: t('descriptions.excelToPdf') || 'Convert Excel spreadsheets to PDF format',
          icon: '📄',
          href: '/tools/excel-to-pdf',
          category: t('categories.pdf'),
        },
        {
          name: t('tools.pdfToImages'),
          description: t('descriptions.pdfToImages') || 'Convert PDF pages to image files (PNG, JPEG)',
          icon: '🖼️',
          href: '/tools/pdf-to-images',
          category: t('categories.pdf'),
        },
        {
          name: t('tools.imagesToPdf'),
          description: t('descriptions.imagesToPdf') || 'Combine multiple images into a single PDF',
          icon: '📸',
          href: '/tools/images-to-pdf',
          category: t('categories.pdf'),
        },
        {
          name: t('tools.pdfToText'),
          description: t('descriptions.pdfToText') || 'Extract text content from PDF documents',
          icon: '📃',
          href: '/tools/pdf-to-text',
          category: t('categories.pdf'),
        },
        {
          name: t('tools.rotatePdf'),
          description: t('descriptions.rotatePdf') || 'Rotate PDF pages by 90, 180, or 270 degrees',
          icon: '🔄',
          href: '/tools/rotate-pdf',
          category: t('categories.pdf'),
        },
        {
          name: t('tools.pdfWatermark'),
          description: t('descriptions.pdfWatermark') || 'Add text or image watermark to PDF pages',
          icon: '💧',
          href: '/tools/pdf-watermark',
          category: t('categories.pdf'),
        },
        {
          name: t('tools.removePdfPages'),
          description: t('descriptions.removePdfPages') || 'Delete specific pages from PDF documents',
          icon: '🗑️',
          href: '/tools/remove-pdf-pages',
          category: t('categories.pdf'),
        },
        {
          name: t('tools.addPageNumbers'),
          description: t('descriptions.addPageNumbers') || 'Add page numbers to PDF documents',
          icon: '🔢',
          href: '/tools/add-page-numbers',
          category: t('categories.pdf'),
        },
      ],
    },
    image: {
      name: t('categories.image'),
      description: t('descriptions.imageCategory') || 'Resize, compress, convert, and edit images',
      icon: '🖼️',
      tools: [
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
    },
    text: {
      name: t('categories.text'),
      description: t('descriptions.textCategory') || 'Text manipulation, transformation, and analysis tools',
      icon: '📝',
      tools: [
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
          description: t('descriptions.textReverser') || 'Reverse text character by character',
          icon: '↔️',
          href: '/tools/text-reverser',
          category: t('categories.text'),
        },
        {
          name: t('tools.slugGenerator'),
          description: t('descriptions.slugGenerator') || 'Create SEO-friendly URL slugs from text',
          icon: '🔗',
          href: '/tools/slug-generator',
          category: t('categories.text'),
        },
        {
          name: t('tools.textDiff'),
          description: t('descriptions.textDiff') || 'Compare two texts and highlight differences',
          icon: '🔍',
          href: '/tools/text-diff',
          category: t('categories.text'),
        },
      ],
    },
    web: {
      name: t('categories.web'),
      description: t('descriptions.webCategory') || 'Web development utilities and code minifiers',
      icon: '🌐',
      tools: [
        {
          name: t('tools.htmlMinifier'),
          description: t('descriptions.htmlMinifier') || 'Minify HTML code to reduce file size',
          icon: '📄',
          href: '/tools/html-minifier',
          category: t('categories.web'),
          popular: true,
        },
        {
          name: t('tools.cssMinifier'),
          description: t('descriptions.cssMinifier') || 'Compress CSS files for faster loading',
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
    },
  });

  // Get current category data or show 404
  const categoriesData = getCategoriesData();
  const category = categorySlug ? categoriesData[categorySlug] : null;
  const tools = category?.tools || [];

  // Show loading state while router is not ready
  if (!router.isReady) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading') || 'Loading...'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show 404 if category not found
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{t('common.categoryNotFound') || 'Category not found'}</p>
            <a href="/" className="btn-primary">
              {t('common.backToHome') || 'Back to Home'}
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />

      <main className="flex-1">
        {/* Category Hero */}
        <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl text-5xl mb-6">
                {category.icon}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">
                {category.name}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {category.description}
              </p>
              
              {/* Breadcrumb */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                <a href="/" className="hover:text-blue-500 transition-colors">{t('header.home')}</a>
                <span>/</span>
                <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
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
                  {t('common.all') || 'All'} {category.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {tools.length} {tools.length === 1 ? (t('common.tool') || 'tool') : (t('common.tools') || 'tools')} {t('common.available') || 'available'}
                </p>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
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
