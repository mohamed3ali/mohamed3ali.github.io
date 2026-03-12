'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import ToolCard from '../components/ToolCard';
import { useTranslation } from '../translations';

export default function HomePage() {
  const { t } = useTranslation();

  // Sample data for categories
  const categories = [
    {
      name: t('categories.developer'),
      description: t('home.categoryDescriptions.developer'),
      icon: '💻',
      href: '/category/developer',
      count: 9,
    },
    {
      name: t('categories.pdf'),
      description: t('home.categoryDescriptions.pdf'),
      icon: '📄',
      href: '/category/pdf',
      count: 14,
    },
    {
      name: t('categories.image'),
      description: t('home.categoryDescriptions.image'),
      icon: '🖼️',
      href: '/category/image',
      count: 3,
    },
    {
      name: t('categories.text'),
      description: t('home.categoryDescriptions.text'),
      icon: '📝',
      href: '/category/text',
      count: 5,
    },
    {
      name: t('categories.web'),
      description: t('home.categoryDescriptions.web'),
      icon: '🌐',
      href: '/category/web',
      count: 5,
    },
  ];

  // Featured tools data
  const featuredTools = [
    {
      name: t('tools.jsonFormatter'),
      description: t('descriptions.jsonFormatter'),
      icon: '{ }',
      href: '/tools/json-formatter',
      category: t('categories.developer'),
      popular: true,
    },
    {
      name: t('tools.pdfCompressor'),
      description: t('descriptions.pdfCompressor'),
      icon: '📄',
      href: '/tools/pdf-compressor',
      category: t('categories.pdf'),
      popular: true,
    },
    {
      name: t('tools.imageCompressor'),
      description: t('descriptions.imageCompressor'),
      icon: '🗜️',
      href: '/tools/image-compressor',
      category: t('categories.image'),
      popular: true,
    },
    {
      name: t('tools.qrGenerator'),
      description: t('descriptions.qrGenerator'),
      icon: '📱',
      href: '/tools/qr-generator',
      category: t('categories.web'),
      popular: true,
    },
    {
      name: t('tools.jwtDecoder'),
      description: t('descriptions.jwtDecoder'),
      icon: '🔓',
      href: '/tools/jwt-decoder',
      category: t('categories.developer'),
      popular: true,
    },
    {
      name: t('tools.passwordGenerator'),
      description: t('descriptions.passwordGenerator'),
      icon: '🔐',
      href: '/tools/password-generator',
      category: t('categories.developer'),
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="section-container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
                  <span className="gradient-text">{t('home.hero.powerfulTools')}</span>
                  <br />
                  <span className="text-gray-900 dark:text-gray-100">{t('home.hero.forEveryTask')}</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              >
                {t('home.hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link href="/tools">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    }
                  >
                    {t('home.hero.exploreTools')}
                  </Button>
                </Link>
                <Link href="/#categories">
                  <Button variant="secondary" size="lg">
                    {t('home.hero.viewAllCategories')}
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-8 pt-8"
              >
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">75+</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('home.stats.toolsAvailable')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">100%</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('home.stats.freeForever')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">1M+</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('home.stats.usersWorldwide')}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Tools Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900"></div>
          <div className="absolute inset-0 mesh-gradient opacity-50"></div>
          <div className="absolute inset-0 grid-pattern"></div>
          
          <div className="section-container relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4"
              >
                <span className="text-lg">✨</span>
                <span>Most Popular Tools</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              >
                {t('home.featured.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 dark:text-gray-400"
              >
                {t('home.featured.subtitle')}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredTools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <Link href={tool.href}>
                    <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Glassmorphism Border Glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        {/* Icon */}
                        <div className="text-5xl mb-5 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                          {tool.icon}
                        </div>
                        
                        {/* Tool Name */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {tool.name}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                          {tool.description}
                        </p>
                        
                        {/* Category Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-xs font-medium text-gray-700 dark:text-gray-300 mb-6">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          {tool.category}
                        </div>
                        
                        {/* Try Now Button */}
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-4 transition-all duration-300">
                          <span>Try Now</span>
                          <svg 
                            className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <Link href="/tools">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <span>{t('home.featured.viewAllTools')}</span>
                  <svg 
                    className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-16 md:py-24">
          <div className="section-container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4"
              >
                {t('home.categories.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-600 dark:text-gray-400"
              >
                {t('home.categories.subtitle')}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={category.href}>
                    <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 card-hover cursor-pointer text-center">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {category.description}
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                        {category.count} {t('common.tools')}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-500 via-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 lg:p-16 text-center text-white"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
                {t('home.cta.title')}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                {t('home.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools">
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    }
                  >
                    {t('home.cta.startUsing')}
                  </Button>
                </Link>
                <Link href="/#categories">
                  <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300">
                    {t('home.cta.learnMore')}
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
