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

export default function CssMinifier() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('css-minifier');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  const handleMinify = async () => {
    if (!input.trim()) {
      setError('Please enter CSS code to minify');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.cssMinifier(input);
      if (response.data.success) {
        const result = response.data.result;
        setOutput(result.minified);
        setStats({
          originalSize: result.originalSize,
          minifiedSize: result.minifiedSize,
          savings: result.savings,
        });
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to minify CSS');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStats(null);
    setError('');
  };

  return (
    <>
      <Head>
        <title>CSS Minifier - Modern Tools</title>
        <meta name="description" content="Minify CSS code to reduce file size" />
      </Head>

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
                {t('tools.cssMinifier')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.cssMinifier')}
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div>
                  <InputArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`body {
  background-color: #ffffff;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}`}
                    label="Original CSS"
                    rows={15}
                  />
                </div>

                {/* Output Section */}
                <div>
                  <OutputArea
                    value={output}
                    label="Minified CSS"
                    rows={15}
                  />
                </div>
              </div>

              {/* Stats */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{stats.originalSize} bytes</div>
                    <div className="text-sm text-gray-400">Original Size</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{stats.minifiedSize} bytes</div>
                    <div className="text-sm text-gray-400">Minified Size</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">{stats.savings}</div>
                    <div className="text-sm text-gray-400">Savings</div>
                  </div>
                </motion.div>
              )}

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
                <Button onClick={handleMinify} disabled={loading}>
                  {loading ? 'Minifying...' : 'Minify CSS'}
                </Button>
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Why Minify CSS?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold mb-2">Faster Rendering</h3>
                  <p className="text-gray-400 text-sm">
                    Reduce CSS file size for faster page rendering
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">📱</div>
                  <h3 className="text-lg font-semibold mb-2">Mobile Friendly</h3>
                  <p className="text-gray-400 text-sm">
                    Optimize for mobile users with smaller files
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">🎨</div>
                  <h3 className="text-lg font-semibold mb-2">Production Ready</h3>
                  <p className="text-gray-400 text-sm">
                    Prepare CSS for production deployment
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
