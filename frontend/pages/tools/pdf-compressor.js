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

export default function PdfCompressor() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('pdf-compressor');
  const [file, setFile] = useState(null);
  const [compressedPdf, setCompressedPdf] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError(t('messages.invalidFile'));
        return;
      }
      setFile(selectedFile);
      setCompressedPdf('');
      setStats(null);
      setError('');
      setMessage('');
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError(t('common.selectFile'));
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await toolsAPI.pdfCompress(file);
      if (response.data.success) {
        setCompressedPdf(`data:application/pdf;base64,${response.data.result}`);
        setStats({
          originalSize: response.data.originalSize,
          compressedSize: response.data.compressedSize,
          savings: response.data.savings
        });
        if (response.data.message) {
          setMessage(response.data.message);
        }
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || t('messages.conversionFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedPdf) return;
    const link = document.createElement('a');
    link.href = compressedPdf;
    link.download = 'compressed.pdf';
    link.click();
  };

  const handleClear = () => {
    setFile(null);
    setCompressedPdf('');
    setStats(null);
    setError('');
    setMessage('');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getSavingsColor = (savingsStr) => {
    const savings = parseFloat(savingsStr);
    if (savings < 0) return 'text-red-400';
    if (savings === 0) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <>
      <SEOHead toolSlug="pdf-compressor" />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col pt-20" dir={isArabic ? 'rtl' : 'ltr'}>
        <Header />

        <main className="flex-grow container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                {t('tools.pdfCompressor')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.pdfCompressor')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* File Upload */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 mb-6">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-lg font-semibold mb-2">{t('common.selectFile')}</p>
                  <div className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
                    {t('common.browse')}
                  </div>
                </label>
                {file && (
                  <div className="mt-6 text-center">
                    <p className="text-gray-300 mb-2">
                      {t('common.selected')}: <span className="text-blue-400">{file.name}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      {t('common.size')}: {formatBytes(file.size)}
                    </p>
                  </div>
                )}
              </div>

              {/* Stats */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-6 mb-6"
                >
                  <h3 className="text-lg font-semibold mb-4 text-center">{t('messages.compressionResults')}</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{t('common.originalSize')}</p>
                      <p className="text-xl font-bold text-blue-400">{formatBytes(stats.originalSize)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{t('common.compressedSize')}</p>
                      <p className={`text-xl font-bold ${stats.compressedSize < stats.originalSize ? 'text-green-400' : stats.compressedSize > stats.originalSize ? 'text-red-400' : 'text-yellow-400'}`}>
                        {formatBytes(stats.compressedSize)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{t('common.savings')}</p>
                      <p className={`text-xl font-bold ${getSavingsColor(stats.savings)}`}>{stats.savings}</p>
                    </div>
                  </div>
                  {message && (
                    <div className="mt-4 pt-4 border-t border-gray-600 text-center">
                      <p className="text-sm text-yellow-400">ℹ️ {message}</p>
                    </div>
                  )}
                </motion.div>
              )}

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

              {/* Success/Warning Message */}
              {compressedPdf && stats && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mb-6 p-6 ${parseFloat(stats.savings) > 0 ? 'bg-green-500/20 border-green-500' : 'bg-yellow-500/20 border-yellow-500'} border rounded-lg`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{parseFloat(stats.savings) > 0 ? '✅' : '⚠️'}</span>
                    <div>
                      <h3 className={`text-lg font-semibold ${parseFloat(stats.savings) > 0 ? 'text-green-300' : 'text-yellow-300'} mb-1`}>
                        {parseFloat(stats.savings) > 0 ? t('messages.pdfCompressedSuccess') : t('messages.pdfAlreadyOptimized')}
                      </h3>
                      <p className={`text-sm ${parseFloat(stats.savings) > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {parseFloat(stats.savings) > 0 ? t('messages.pdfOptimizedReady') : t('messages.pdfAlreadyCompressed')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={handleCompress} disabled={loading || !file}>
                  {loading ? t('common.processing') : t('buttons.compress')}
                </Button>
                {compressedPdf && (
                  <Button onClick={handleDownload} variant="secondary">
                    {t('buttons.downloadResult')}
                  </Button>
                )}
                <Button onClick={handleClear} variant="secondary">
                  {t('common.clear')}
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('features.whyCompressPdf')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">📧</div>
                  <h3 className="text-lg font-semibold mb-2">{t('features.emailFriendly.title')}</h3>
                  <p className="text-gray-400 text-sm">
                    {t('features.emailFriendly.description')}
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold mb-2">{t('features.fasterLoading.title')}</h3>
                  <p className="text-gray-400 text-sm">
                    {t('features.fasterLoading.description')}
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">💾</div>
                  <h3 className="text-lg font-semibold mb-2">{t('features.saveStorage.title')}</h3>
                  <p className="text-gray-400 text-sm">
                    {t('features.saveStorage.description')}
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
