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

export default function TextReverser() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('text-reverser');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReverse = async () => {
    if (!input.trim()) {
      setError('Please enter text to reverse');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.textReverse(input);
      if (response.data.success) {
        setOutput(response.data.result);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reverse text');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
  };

  return (
    <>
      <SEOHead toolSlug="text-reverser" />

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
                {t('tools.textReverser')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.textReverser')}
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div>
                  <InputArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to reverse..."
                    label="Original Text"
                  />
                </div>

                {/* Output Section */}
                <div>
                  <OutputArea
                    value={output}
                    label="Reversed Text"
                  />
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
                <Button onClick={handleReverse} disabled={loading}>
                  {loading ? 'Reversing...' : 'Reverse Text'}
                </Button>
                {output && (
                  <Button onClick={handleSwap} variant="secondary">
                    Swap
                  </Button>
                )}
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>
            </div>

            {/* Examples */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">Original</h3>
                  <p className="text-gray-300 mb-3">Hello World</p>
                  <h3 className="text-lg font-semibold mb-3 text-purple-400">Reversed</h3>
                  <p className="text-gray-300">dlroW olleH</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">Original</h3>
                  <p className="text-gray-300 mb-3">12345</p>
                  <h3 className="text-lg font-semibold mb-3 text-purple-400">Reversed</h3>
                  <p className="text-gray-300">54321</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">Original</h3>
                  <p className="text-gray-300 mb-3">A man a plan a canal Panama</p>
                  <h3 className="text-lg font-semibold mb-3 text-purple-400">Reversed</h3>
                  <p className="text-gray-300">amanaP lanac a nalp a nam A</p>
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
