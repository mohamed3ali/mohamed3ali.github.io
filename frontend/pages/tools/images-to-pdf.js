import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function ImagesToPdf() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('images-to-pdf');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length > 0) {
      setFiles(validFiles);
      setError('');
    } else {
      setError('Please select valid image files');
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:5000/api/tools/images-to-pdf', {
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
        a.download = data.filename || 'images-combined.pdf';
        a.click();
        setError('');
      } else {
        setError(data.error || 'Conversion failed');
      }
    } catch (err) {
      setError('Failed to create PDF from images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Images to PDF Converter - Modern Tools</title>
        <meta name="description" content="Combine multiple images into a single PDF" />
      </Head>

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
                {t('tools.imagesToPdf')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.imagesToPdf')}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-dashed border-gray-700 rounded-lg p-8 text-center mb-6">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="images-upload"
                />
                <label htmlFor="images-upload" className="cursor-pointer">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-lg mb-2">
                    Click to select images
                  </p>
                  <p className="text-sm text-gray-400">
                    Select multiple images to combine into one PDF
                  </p>
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Selected Images ({files.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700/50 p-3 rounded">
                        <div>
                          <p className="font-semibold text-sm">{file.name}</p>
                          <p className="text-xs text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={handleConvert} disabled={loading || files.length === 0}>
                  {loading ? 'Creating PDF...' : 'Create PDF'}
                </Button>
                <Button onClick={() => setFiles([])} variant="secondary">
                  Clear All
                </Button>
              </div>

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-400">📌 Note</h3>
                <p className="text-sm text-gray-300">
                  This feature requires additional backend implementation. Images will be added in the order selected.
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
