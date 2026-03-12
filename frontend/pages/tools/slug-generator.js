import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import InputArea from '../../components/InputArea';
import OutputArea from '../../components/OutputArea';
import Button from '../../components/Button';
import { toolsAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function SlugGenerator() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('slug-generator');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('Please enter text to slugify');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.textSlug(input);
      if (response.data.success) {
        setOutput(response.data.result);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate slug');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <>
      <SEOHead toolSlug="slug-generator" />

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
                {t('tools.slugGenerator')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.slugGenerator')}
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div>
                  <InputArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="How to Create Amazing Web Apps"
                    label="Text"
                    rows={6}
                  />
                </div>

                {/* Output Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Generated Slug
                  </label>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-h-[150px] flex flex-col">
                    {output ? (
                      <>
                        <div className="flex-grow bg-gray-900 rounded p-4 font-mono text-green-400 break-all">
                          {output}
                        </div>
                        <div className="mt-3">
                          <Button onClick={handleCopy} variant="secondary" className="w-full">
                            {copied ? '✓ Copied' : 'Copy Slug'}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center flex-grow text-gray-500">
                        Slug will appear here
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300"
                >
                  {error}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Button onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Slug'}
                </Button>
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>
            </div>

            {/* Examples */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Examples</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Input:</p>
                      <p className="text-gray-300">"How to Create Amazing Web Apps"</p>
                    </div>
                    <div className="text-2xl text-gray-500">→</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Slug:</p>
                      <p className="text-green-400 font-mono">how-to-create-amazing-web-apps</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Input:</p>
                      <p className="text-gray-300">"10 Best Practices for SEO!"</p>
                    </div>
                    <div className="text-2xl text-gray-500">→</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Slug:</p>
                      <p className="text-green-400 font-mono">10-best-practices-for-seo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Why Use Slugs?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">SEO Friendly</h3>
                  <p className="text-gray-400 text-sm">
                    Improve search engine rankings with clean URLs
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">👁️</div>
                  <h3 className="text-lg font-semibold mb-2">Readable</h3>
                  <p className="text-gray-400 text-sm">
                    Create human-readable, descriptive URLs
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">🔗</div>
                  <h3 className="text-lg font-semibold mb-2">Web Standard</h3>
                  <p className="text-gray-400 text-sm">
                    Follow web best practices for URL structure
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
