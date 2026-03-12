import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import InputArea from '../../components/InputArea';
import Button from '../../components/Button';
import { toolsAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function QrGenerator() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('qr-generator');
  const [input, setInput] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [size, setSize] = useState(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError(t('messages.noDataProvided'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.qrGenerate(input, size);
      if (response.data.success) {
        setQrCode(response.data.result);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qrcode.png';
    link.click();
  };

  const handleClear = () => {
    setInput('');
    setQrCode('');
    setError('');
  };

  return (
    <>
      <SEOHead toolSlug="qr-generator" />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col pt-20">
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
                {t('tools.qrGenerator')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.qrGenerator')}
              </p>
            </div>

            {/* Tool Interface */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div>
                  <InputArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="https://example.com or any text"
                    label="Text or URL"
                    rows={6}
                  />

                  {/* Size Control */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      QR Code Size: {size}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="800"
                      step="50"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>200px</span>
                      <span>800px</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Generated QR Code
                  </label>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                    {qrCode ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-lg"
                      >
                        <img src={qrCode} alt="QR Code" className="max-w-full h-auto" />
                      </motion.div>
                    ) : (
                      <p className="text-gray-500">QR code will appear here</p>
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
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate QR Code'}
                </Button>
                {qrCode && (
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                  >
                    Download
                  </Button>
                )}
                <Button
                  onClick={handleClear}
                  variant="secondary"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">🔗</div>
                  <h3 className="text-lg font-semibold mb-2">Website URLs</h3>
                  <p className="text-gray-400">
                    Share website links easily with smartphone cameras
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">📱</div>
                  <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
                  <p className="text-gray-400">
                    Store vCard data for quick contact sharing
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">📝</div>
                  <h3 className="text-lg font-semibold mb-2">Text & Data</h3>
                  <p className="text-gray-400">
                    Encode WiFi credentials, product info, and more
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
