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

export default function PdfMerger() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('pdf-merger');
  const [files, setFiles] = useState([]);
  const [mergedPdf, setMergedPdf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length < 2) {
      setError('Please select at least 2 PDF files');
      return;
    }
    
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== selectedFiles.length) {
      setError('All files must be PDF files');
      return;
    }
    
    setFiles(pdfFiles);
    setMergedPdf('');
    setError('');
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.pdfMerge(files);
      if (response.data.success) {
        setMergedPdf(`data:application/pdf;base64,${response.data.result}`);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to merge PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!mergedPdf) return;
    const link = document.createElement('a');
    link.href = mergedPdf;
    link.download = 'merged.pdf';
    link.click();
  };

  const handleClear = () => {
    setFiles([]);
    setMergedPdf('');
    setError('');
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <>
      <SEOHead toolSlug="pdf-merger" />

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
                {t('tools.pdfMerger')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.pdfMerger')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* File Upload */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 mb-6">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center justify-center py-8"
                >
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-lg font-semibold mb-2">Select PDF Files</p>
                  <p className="text-sm text-gray-400">Choose 2 or more PDF files to merge</p>
                  <div className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
                    Browse Files
                  </div>
                </label>
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Selected Files ({files.length})</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">📄</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300 transition-colors ml-4"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
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
              {mergedPdf && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-6 bg-green-500/20 border border-green-500 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✅</span>
                    <div>
                      <h3 className="text-lg font-semibold text-green-300 mb-1">PDF Merged Successfully!</h3>
                      <p className="text-sm text-green-400">Your PDF files have been merged into one document.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={handleMerge} disabled={loading || files.length < 2}>
                  {loading ? 'Merging...' : 'Merge PDFs'}
                </Button>
                {mergedPdf && (
                  <Button onClick={handleDownload} variant="secondary">
                    Download Merged PDF
                  </Button>
                )}
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">📑</div>
                  <h3 className="text-lg font-semibold mb-2">Multiple Files</h3>
                  <p className="text-gray-400 text-sm">
                    Merge unlimited PDF files in one go
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
                  <p className="text-gray-400 text-sm">
                    Quick merging with optimized algorithms
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">🔒</div>
                  <h3 className="text-lg font-semibold mb-2">Secure</h3>
                  <p className="text-gray-400 text-sm">
                    Files processed securely, not stored
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
