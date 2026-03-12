'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../translations';
import Logo from './Logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, changeLanguage, t } = useTranslation();

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDark = localStorage.getItem('darkMode') === 'true';
      
      setIsDarkMode(savedDark);
      
      // Apply dark mode
      if (savedDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Handle scroll for frosted glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  const toolCategories = [
    {
      name: t('categories.developer'),
      href: '/category/developer',
      icon: '💻',
      tools: [
        { name: t('tools.jsonFormatter'), href: '/tools/json-formatter' },
        { name: t('tools.base64Encoder'), href: '/tools/base64-encoder' },
        { name: t('tools.urlEncoder'), href: '/tools/url-encoder' },
        { name: t('tools.jwtDecoder'), href: '/tools/jwt-decoder' },
        { name: t('tools.uuidGenerator'), href: '/tools/uuid-generator' },
        { name: t('tools.hashGenerator'), href: '/tools/hash-generator' },
        { name: t('tools.passwordGenerator'), href: '/tools/password-generator' },
        { name: t('tools.qrGenerator'), href: '/tools/qr-generator' },
        { name: t('tools.imageCompressor'), href: '/tools/image-compressor' },
      ],
    },
    {
      name: t('categories.pdf'),
      href: '/category/pdf',
      icon: '📄',
      tools: [
        { name: t('tools.pdfMerger'), href: '/tools/pdf-merger' },
        { name: t('tools.pdfSplitter'), href: '/tools/pdf-splitter' },
        { name: t('tools.pdfCompressor'), href: '/tools/pdf-compressor' },
        { name: t('tools.pdfToWord'), href: '/tools/pdf-to-word' },
        { name: t('tools.wordToPdf'), href: '/tools/word-to-pdf' },
        { name: t('tools.pdfToExcel'), href: '/tools/pdf-to-excel' },
        { name: t('tools.excelToPdf'), href: '/tools/excel-to-pdf' },
        { name: t('tools.pdfToImages'), href: '/tools/pdf-to-images' },
        { name: t('tools.imagesToPdf'), href: '/tools/images-to-pdf' },
        { name: t('tools.pdfToText'), href: '/tools/pdf-to-text' },
        { name: t('tools.rotatePdf'), href: '/tools/rotate-pdf' },
        { name: t('tools.pdfWatermark'), href: '/tools/pdf-watermark' },
        { name: t('tools.removePdfPages'), href: '/tools/remove-pdf-pages' },
        { name: t('tools.addPageNumbers'), href: '/tools/add-page-numbers' },
      ],
    },
    {
      name: t('categories.image'),
      href: '/category/image',
      icon: '🖼️',
      tools: [
        { name: t('tools.imageResizer'), href: '/tools/image-resizer' },
        { name: t('tools.imageConverter'), href: '/tools/image-converter' },
        { name: t('tools.imageCompressor'), href: '/tools/image-compressor' },
      ],
    },
    {
      name: t('categories.text'),
      href: '/category/text',
      icon: '📝',
      tools: [
        { name: t('tools.caseConverter'), href: '/tools/case-converter' },
        { name: t('tools.wordCounter'), href: '/tools/word-counter' },
        { name: t('tools.textReverser'), href: '/tools/text-reverser' },
        { name: t('tools.slugGenerator'), href: '/tools/slug-generator' },
        { name: t('tools.textDiff'), href: '/tools/text-diff' },
      ],
    },
    {
      name: t('categories.web'),
      href: '/category/web',
      icon: '🌐',
      tools: [
        { name: t('tools.htmlMinifier'), href: '/tools/html-minifier' },
        { name: t('tools.cssMinifier'), href: '/tools/css-minifier' },
        { name: t('tools.jsMinifier'), href: '/tools/js-minifier' },
        { name: t('tools.markdownConverter'), href: '/tools/markdown-converter' },
        { name: t('tools.qrGenerator'), href: '/tools/qr-generator' },
      ],
    },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <nav className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Logo size="md" showText={true} />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {t('header.home')}
            </Link>
            {toolCategories.map((category) => (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(category.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-1">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {activeDropdown === category.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                    >
                      <Link
                        href={category.href}
                        className="block px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t('header.viewAll')} {category.name}
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                      {category.tools.map((tool) => (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
              aria-label={language === 'en' ? t('header.switchToArabic') : t('header.switchToEnglish')}
              title={language === 'en' ? t('header.switchToArabic') : t('header.switchToEnglish')}
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {language === 'en' ? 'عربي' : 'English'}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label={t('header.darkMode')}
            >
              {isDarkMode ? (
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label={t('header.menu')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl max-h-[70vh] overflow-y-auto"
            >
              <Link
                href="/"
                className="block px-4 py-3 mx-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
              {toolCategories.map((category) => (
                <div key={category.name} className="mb-2">
                  <div className="px-4 py-2 mx-2 text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <Link
                    href={category.href}
                    className="block px-6 py-2 mx-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors duration-200 font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.viewAll')}
                  </Link>
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="block px-6 py-2 mx-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
