import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import OutputArea from '../../components/OutputArea';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function PdfToText() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('pdf-to-text');
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState(''); // Separate error for file selection

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileError('');
      setError('');
      setOutput(''); // Clear previous output when new file is selected
    } else {
      setFileError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setFileError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setFileError('');
    setOutput(''); // Clear previous output
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/tools/pdf-to-text', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.result);
        setError(''); // Clear any previous errors
      } else {
        setError(data.error || 'Text extraction failed');
        setOutput(''); // Clear output on error
      }
    } catch (err) {
      setError('Failed to extract text from PDF. Please check if the server is running.');
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead toolSlug="pdf-to-text" />

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
                {t('tools.pdfToText')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.pdfToText')}
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div>
                  <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-dashed border-gray-700 rounded-lg p-8 text-center mb-6">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <div className="text-6xl mb-4">📃</div>
                      <p className="text-lg mb-2">
                        {file ? file.name : 'Click to select PDF'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Extract all readable text
                      </p>
                    </label>
                  </div>

                  {/* Only show file selection errors here */}
                  {fileError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300"
                    >
                      {fileError}
                    </motion.div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <Button onClick={handleExtract} disabled={loading || !file}>
                      {loading ? 'Extracting...' : 'Extract Text'}
                    </Button>
                  </div>
                </div>

                {/* Output Section */}
                <div>
                  <OutputArea
                    title="Extracted Text"
                    result={output}
                    loading={loading}
                    error={error}
                    outputType="text"
                    copyable={true}
                    downloadable={true}
                    downloadFileName="extracted-text.txt"
                  />
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-400">📌 Note</h3>
                <p className="text-sm text-gray-300">
                  Extracts all readable text from your PDF. Works best with text-based PDFs (not scanned images).
                </p>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}
