import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function WordToPdf() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('word-to-pdf');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
      setSuccess(false);
    } else {
      setError('Please select a valid Word file (.doc or .docx)');
      setFile(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a Word file');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/tools/word-to-pdf', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        const blob = new Blob(
          [Uint8Array.from(atob(data.result), c => c.charCodeAt(0))],
          { type: 'application/pdf' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename || 'converted.pdf';
        a.click();
      } else {
        let errorMsg = data.error || 'Conversion failed';
        if (data.note) {
          errorMsg += '\n\n' + data.note;
        }
        setError(errorMsg);
      }
    } catch (err) {
      setError('Failed to convert Word to PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setError('');
    setSuccess(false);
  };

  return (
    <>
      <SEOHead toolSlug="word-to-pdf" />

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
                {t('tools.wordToPdf')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.wordToPdf')}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Upload Area */}
              <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-dashed border-gray-700 rounded-lg p-8 text-center mb-6">
                <input
                  type="file"
                  accept=".doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="word-upload"
                />
                <label htmlFor="word-upload" className="cursor-pointer">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-lg mb-2">
                    {file ? file.name : 'Click to select Word file'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports .doc and .docx formats
                  </p>
                </label>
              </div>

              {/* File Info */}
              {file && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={handleClear}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
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

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300"
                >
                  ✓ Word converted to PDF successfully!
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={handleConvert} disabled={loading || !file}>
                  {loading ? 'Converting...' : 'Convert to PDF'}
                </Button>
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>

              {/* Info Note */}
              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-400">📌 Note</h3>
                <p className="text-sm text-gray-300">
                  This feature requires additional backend implementation. Word to PDF conversion
                  will preserve all formatting, images, and layout from your document.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Why Convert to PDF?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">🔒</div>
                  <h3 className="text-lg font-semibold mb-2">Universal Format</h3>
                  <p className="text-gray-400 text-sm">
                    PDFs work on any device without formatting issues
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">📄</div>
                  <h3 className="text-lg font-semibold mb-2">Professional</h3>
                  <p className="text-gray-400 text-sm">
                    Perfect for sharing documents professionally
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">🛡️</div>
                  <h3 className="text-lg font-semibold mb-2">Secure</h3>
                  <p className="text-gray-400 text-sm">
                    Prevent unwanted editing and modifications
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
