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

export default function TextDiff() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('text-diff');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!text1.trim() || !text2.trim()) {
      setError('Please enter both texts to compare');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.textDiff(text1, text2);
      if (response.data.success) {
        setDiff(response.data.result);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to compare texts');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText1('');
    setText2('');
    setDiff([]);
    setError('');
  };

  return (
    <>
      <SEOHead toolSlug="text-diff" />

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
                {t('tools.textDiff')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.textDiff')}
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Text 1 */}
                <div>
                  <InputArea
                    value={text1}
                    onChange={(e) => setText1(e.target.value)}
                    placeholder="Enter first text..."
                    label="Text 1 (Original)"
                    rows={10}
                  />
                </div>

                {/* Text 2 */}
                <div>
                  <InputArea
                    value={text2}
                    onChange={(e) => setText2(e.target.value)}
                    placeholder="Enter second text..."
                    label="Text 2 (Modified)"
                    rows={10}
                  />
                </div>
              </div>

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
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <Button onClick={handleCompare} disabled={loading}>
                  {loading ? 'Comparing...' : 'Compare Texts'}
                </Button>
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>

              {/* Diff Results */}
              {diff.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Differences</h3>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-red-500/30 border border-red-500 rounded"></span>
                        <span className="text-gray-400">Removed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-green-500/30 border border-green-500 rounded"></span>
                        <span className="text-gray-400">Added</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded p-4 font-mono text-sm overflow-x-auto">
                    <div className="whitespace-pre-wrap break-words">
                      {diff.map((part, index) => {
                        if (part.added) {
                          return (
                            <span key={index} className="bg-green-500/30 text-green-300">
                              {part.value}
                            </span>
                          );
                        }
                        if (part.removed) {
                          return (
                            <span key={index} className="bg-red-500/30 text-red-300 line-through">
                              {part.value}
                            </span>
                          );
                        }
                        return <span key={index} className="text-gray-300">{part.value}</span>;
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Use Cases */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">📝</div>
                  <h3 className="text-lg font-semibold mb-2">Document Comparison</h3>
                  <p className="text-gray-400 text-sm">
                    Compare different versions of documents
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">Change Detection</h3>
                  <p className="text-gray-400 text-sm">
                    Quickly identify what changed between versions
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">✍️</div>
                  <h3 className="text-lg font-semibold mb-2">Proofreading</h3>
                  <p className="text-gray-400 text-sm">
                    Review edits and revisions made to text
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
