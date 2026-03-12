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

export default function PdfSplitter() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('pdf-splitter');
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState('');
  const [splitPdf, setSplitPdf] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a valid PDF file');
        return;
      }
      setFile(selectedFile);
      setSplitPdf('');
      setError('');
    }
  };

  const handleSplit = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.pdfSplit(file, pages);
      if (response.data.success) {
        setSplitPdf(`data:application/pdf;base64,${response.data.result}`);
        setPageCount(response.data.pageCount);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to split PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!splitPdf) return;
    const link = document.createElement('a');
    link.href = splitPdf;
    link.download = 'split.pdf';
    link.click();
  };

  const handleClear = () => {
    setFile(null);
    setPages('');
    setSplitPdf('');
    setPageCount(0);
    setError('');
  };

  return (
    <>
      <SEOHead toolSlug="pdf-splitter" />

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
                {t('tools.pdfSplitter')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.pdfSplitter')}
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
                  <p className="text-lg font-semibold mb-2">Select PDF File</p>
                  <div className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
                    Browse File
                  </div>
                </label>
                {file && (
                  <p className="mt-4 text-center text-gray-300">
                    Selected: <span className="text-blue-400">{file.name}</span>
                  </p>
                )}
              </div>

              {/* Page Selection */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6"
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pages to Extract (Optional)
                  </label>
                  <input
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="e.g., 1,3,5-10 (leave empty for all pages)"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Enter page numbers separated by commas. Use hyphen for ranges (e.g., 1-5)
                  </p>
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
              {splitPdf && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-6 bg-green-500/20 border border-green-500 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✅</span>
                    <div>
                      <h3 className="text-lg font-semibold text-green-300 mb-1">PDF Split Successfully!</h3>
                      <p className="text-sm text-green-400">Extracted {pageCount} page(s) from the PDF.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={handleSplit} disabled={loading || !file}>
                  {loading ? 'Splitting...' : 'Split PDF'}
                </Button>
                {splitPdf && (
                  <Button onClick={handleDownload} variant="secondary">
                    Download PDF
                  </Button>
                )}
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">How to Use</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">1️⃣</div>
                  <h3 className="text-lg font-semibold mb-2">Upload PDF</h3>
                  <p className="text-gray-400 text-sm">
                    Select the PDF file you want to split
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">2️⃣</div>
                  <h3 className="text-lg font-semibold mb-2">Specify Pages</h3>
                  <p className="text-gray-400 text-sm">
                    Enter page numbers or ranges to extract
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">3️⃣</div>
                  <h3 className="text-lg font-semibold mb-2">Download</h3>
                  <p className="text-gray-400 text-sm">
                    Get your extracted pages as a new PDF
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
