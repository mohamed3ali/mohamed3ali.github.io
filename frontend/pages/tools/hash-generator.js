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

export default function HashGenerator() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('hash-generator');
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('sha256');
  const [hashes, setHashes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const algorithms = ['md5', 'sha1', 'sha256', 'sha512'];

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError(t('messages.noDataProvided'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.hashGenerate(input, algorithm);
      if (response.data.success) {
        setHashes(prev => ({
          ...prev,
          [algorithm]: response.data.result
        }));
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate hash');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!input.trim()) {
      setError('Please enter text to hash');
      return;
    }

    setLoading(true);
    setError('');
    const results = {};
    
    try {
      for (const algo of algorithms) {
        const response = await toolsAPI.hashGenerate(input, algo);
        if (response.data.success) {
          results[algo] = response.data.result;
        }
      }
      setHashes(results);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate hashes');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (hash, algo) => {
    navigator.clipboard.writeText(hash);
    setCopied(algo);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleClear = () => {
    setInput('');
    setHashes({});
    setError('');
  };

  return (
    <>
      <SEOHead toolSlug="hash-generator" />

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
                {t('tools.hashGenerator')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.hashGenerator')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Input */}
              <div className="mb-6">
                <InputArea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text to hash..."
                  label="Input Text"
                  rows={4}
                />
              </div>

              {/* Algorithm Selection */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Hash Algorithm
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {algorithms.map((algo) => (
                    <button
                      key={algo}
                      onClick={() => setAlgorithm(algo)}
                      className={`px-4 py-3 rounded-lg font-semibold uppercase transition-all duration-300 ${
                        algorithm === algo
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {algo}
                    </button>
                  ))}
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
                <Button onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Hash'}
                </Button>
                <Button onClick={handleGenerateAll} disabled={loading} variant="secondary">
                  Generate All
                </Button>
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>

              {/* Hash Results */}
              {Object.keys(hashes).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {Object.entries(hashes).map(([algo, hash]) => (
                    <div
                      key={algo}
                      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold uppercase text-gray-400">{algo}</h3>
                        <button
                          onClick={() => handleCopy(hash, algo)}
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {copied === algo ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-gray-900 rounded p-3 font-mono text-sm break-all text-green-400">
                        {hash}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Hash Functions</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-red-400">MD5</h3>
                  <p className="text-gray-400 text-sm">128-bit (32 hex chars)</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-yellow-400">SHA1</h3>
                  <p className="text-gray-400 text-sm">160-bit (40 hex chars)</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-green-400">SHA256</h3>
                  <p className="text-gray-400 text-sm">256-bit (64 hex chars)</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-blue-400">SHA512</h3>
                  <p className="text-gray-400 text-sm">512-bit (128 hex chars)</p>
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
