import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import InputArea from '../../components/InputArea';
import OutputArea from '../../components/OutputArea';
import Button from '../../components/Button';
import SEOHead from '../../components/SEOHead';
import { toolsAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function JsonFormatter() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get SEO data for this tool
  const seoData = getSeoData('json-formatter');

  const handleFormat = async () => {
    if (!input.trim()) {
      setError(t('messages.noDataProvided'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.jsonFormat(input);
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

  const handleMinify = async () => {
    if (!input.trim()) {
      setError(t('messages.noDataProvided'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.jsonMinify(input);
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

  return (
    <>
      <SEOHead toolSlug="json-formatter" />

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
                {t('tools.jsonFormatter')}
              </h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                {t('descriptions.jsonFormatter')}
              </p>
            </div>

            {/* Tool Interface */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div>
                  <InputArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='{"name": "John", "age": 30}'
                    label={t('common.input')}
                  />
                </div>

                {/* Output Section */}
                <div>
                  <OutputArea
                    value={output}
                    label={t('common.output')}
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
                <Button
                  onClick={handleFormat}
                  disabled={loading}
                >
                  {loading ? t('common.processing') : t('buttons.format')}
                </Button>
                <Button
                  onClick={handleMinify}
                  disabled={loading}
                  variant="secondary"
                >
                  {t('buttons.minify')}
                </Button>
                <Button
                  onClick={handleClear}
                  variant="secondary"
                >
                  {t('common.clear')}
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('features.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">🎨</div>
                  <h3 className="text-lg font-semibold mb-2">{t('features.jsonFormat.title')}</h3>
                  <p className="text-gray-400">
                    {t('features.jsonFormat.description')}
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold mb-2">{t('features.jsonMinify.title')}</h3>
                  <p className="text-gray-400">
                    {t('features.jsonMinify.description')}
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">✓</div>
                  <h3 className="text-lg font-semibold mb-2">{t('features.jsonValidate.title')}</h3>
                  <p className="text-gray-400">
                    {t('features.jsonValidate.description')}
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
