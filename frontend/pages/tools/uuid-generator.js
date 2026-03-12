import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { toolsAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function UuidGenerator() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('uuid-generator');
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setCopied(false);
    
    try {
      const response = await toolsAPI.uuidGenerate(count);
      if (response.data.success) {
        const result = response.data.result;
        setUuids(Array.isArray(result) ? result : [result]);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate UUIDs');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (uuid) => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEOHead toolSlug="uuid-generator" />

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
                {t('tools.uuidGenerator')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.uuidGenerator')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Count Selector */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of UUIDs: {count}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>100</span>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center mb-8">
                <Button onClick={handleGenerate} disabled={loading} className="px-12">
                  {loading ? t('common.processing') : t('buttons.generate')}
                </Button>
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

              {/* UUID List */}
              {uuids.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Generated UUIDs</h3>
                    <Button onClick={handleCopyAll} variant="secondary" className="text-sm py-2 px-4">
                      {copied ? '✓ Copied All' : 'Copy All'}
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {uuids.map((uuid, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-900 rounded-lg p-3 font-mono text-sm hover:bg-gray-900/80 transition-colors"
                      >
                        <span className="text-blue-300">{uuid}</span>
                        <button
                          onClick={() => handleCopy(uuid)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          📋
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">About UUIDs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">🔑</div>
                  <h3 className="text-lg font-semibold mb-2">Unique IDs</h3>
                  <p className="text-gray-400 text-sm">
                    128-bit universally unique identifiers
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">🎲</div>
                  <h3 className="text-lg font-semibold mb-2">Random</h3>
                  <p className="text-gray-400 text-sm">
                    Version 4 UUIDs use random number generation
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">💾</div>
                  <h3 className="text-lg font-semibold mb-2">Database Keys</h3>
                  <p className="text-gray-400 text-sm">
                    Perfect for primary keys and identifiers
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
