import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import InputArea from '../../components/InputArea';
import OutputArea from '../../components/OutputArea';
import Button from '../../components/Button';
import { toolsAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import { useTranslation } from '../../translations';

export default function Base64Encoder() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('base64-encoder');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!input.trim()) {
      setError(t('messages.noDataProvided'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = mode === 'encode' 
        ? await toolsAPI.base64Encode(input)
        : await toolsAPI.base64Decode(input);
        
      if (response.data.success) {
        setOutput(response.data.result);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || t('messages.conversionFailed'));
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
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <>
      <SEOHead toolSlug="base64-encoder" />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col pt-20" dir={isArabic ? 'rtl' : 'ltr'}>
        <Header />

        <main className="flex-grow container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                {t('tools.base64Encoder')}
              </h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                {t('descriptions.base64Encoder')}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="max-w-6xl mx-auto mb-6">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setMode('encode')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    mode === 'encode'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {t('buttons.encode')}
                </button>
                <button
                  onClick={() => setMode('decode')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    mode === 'decode'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {t('buttons.decode')}
                </button>
              </div>
            </div>

            {/* Tool Interface */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div>
                  <InputArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'encode' ? t('labels.enterText') : t('labels.enterBase64')}
                    label={mode === 'encode' ? t('labels.plainText') : t('labels.base64String')}
                  />
                </div>

                {/* Output Section */}
                <div>
                  <OutputArea
                    value={output}
                    label={mode === 'encode' ? t('labels.base64String') : t('labels.plainText')}
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
                <Button onClick={handleProcess} disabled={loading}>
                  {loading ? t('common.processing') : mode === 'encode' ? t('buttons.encode') : t('buttons.decode')}
                </Button>
                {output && (
                  <Button onClick={handleSwap} variant="secondary">
                    {t('buttons.swap')}
                  </Button>
                )}
                <Button onClick={handleClear} variant="secondary">
                  {t('common.clear')}
                </Button>
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">About Base64</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">📝</div>
                  <h3 className="text-lg font-semibold mb-2">Text Encoding</h3>
                  <p className="text-gray-400 text-sm">
                    Convert text to Base64 for safe transmission
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">🔓</div>
                  <h3 className="text-lg font-semibold mb-2">Easy Decoding</h3>
                  <p className="text-gray-400 text-sm">
                    Decode Base64 strings back to readable text
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
                  <p className="text-gray-400 text-sm">
                    Instant encoding and decoding operations
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
