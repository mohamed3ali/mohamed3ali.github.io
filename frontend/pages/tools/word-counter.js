import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import InputArea from '../../components/InputArea';
import Button from '../../components/Button';
import { toolsAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function WordCounter() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('word-counter');
  const [input, setInput] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCount = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.textCount(input);
      if (response.data.success) {
        setStats(response.data.result);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to count text');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setStats(null);
    setError('');
  };

  return (
    <>
      <SEOHead toolSlug="word-counter" />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col pt-20">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                {t('tools.wordCounter')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.wordCounter')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Input */}
              <div className="mb-6">
                <InputArea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    handleCount();
                  }}
                  placeholder="Start typing or paste your text here..."
                  label="Text to Analyze"
                  rows={10}
                />
              </div>

              {/* Live Stats */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">{stats.words}</div>
                      <div className="text-sm text-gray-400">Words</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">{stats.characters}</div>
                      <div className="text-sm text-gray-400">Characters</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-500/30 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-pink-400 mb-2">{stats.sentences}</div>
                      <div className="text-sm text-gray-400">Sentences</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">{stats.paragraphs}</div>
                      <div className="text-sm text-gray-400">Paragraphs</div>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Characters (no spaces):</span>
                        <span className="font-semibold">{stats.charactersNoSpaces}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Lines:</span>
                        <span className="font-semibold">{stats.lines}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reading Time:</span>
                        <span className="font-semibold">{stats.readingTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300"
                >
                  {error}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={handleClear} variant="secondary">
                  Clear Text
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold mb-2">Real-Time Counting</h3>
                  <p className="text-gray-400 text-sm">
                    Statistics update as you type
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">📊</div>
                  <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
                  <p className="text-gray-400 text-sm">
                    Get comprehensive text statistics
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">📖</div>
                  <h3 className="text-lg font-semibold mb-2">Reading Time</h3>
                  <p className="text-gray-400 text-sm">
                    Estimate reading time automatically
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}
