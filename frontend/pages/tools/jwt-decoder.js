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

export default function JwtDecoder() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('jwt-decoder');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDecode = async () => {
    if (!input.trim()) {
      setError(t('messages.noDataProvided'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.jwtDecode(input);
      if (response.data.success) {
        setOutput(JSON.stringify(response.data.result, null, 2));
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
      <SEOHead toolSlug="jwt-decoder" />

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
                {t('tools.jwtDecoder')}
              </h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                {t('descriptions.jwtDecoder')}
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
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    label="JWT Token"
                    rows={8}
                  />
                </div>

                {/* Output Section */}
                <div>
                  <OutputArea
                    value={output}
                    label="Decoded JWT"
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
                  onClick={handleDecode}
                  disabled={loading}
                >
                  {loading ? t('common.processing') : t('buttons.decode')}
                </Button>
                <Button
                  onClick={handleClear}
                  variant="secondary"
                >
                  {t('common.clear')}
                </Button>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">About JWT</h3>
                <p className="text-gray-300">
                  JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact 
                  and self-contained way for securely transmitting information between parties 
                  as a JSON object. This tool decodes the token to reveal the header and payload 
                  (claims) without verification.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h4 className="font-semibold mb-2 text-blue-400">Header</h4>
                  <p className="text-gray-400 text-sm">
                    Contains token type and signing algorithm
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h4 className="font-semibold mb-2 text-purple-400">Payload</h4>
                  <p className="text-gray-400 text-sm">
                    Contains the claims (user data and metadata)
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
