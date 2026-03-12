import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function RotatePdf() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('rotate-pdf');
  const [file, setFile] = useState(null);
  const [rotation, setRotation] = useState(90);
  const [pages, setPages] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleRotate = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('rotation', rotation);
      formData.append('pages', pages);

      const response = await fetch('http://localhost:5000/api/tools/pdf-rotate', {
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
        a.download = data.filename || 'rotated.pdf';
        a.click();
        setError('');
      } else {
        setError(data.error || 'Rotation failed');
      }
    } catch (err) {
      setError('Failed to rotate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Rotate PDF - Modern Tools</title>
        <meta name="description" content="Rotate PDF pages by 90, 180, or 270 degrees" />
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
                {t('tools.rotatePdf')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.rotatePdf')}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-dashed border-gray-700 rounded-lg p-8 text-center mb-6">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <div className="text-6xl mb-4">🔄</div>
                  <p className="text-lg mb-2">
                    {file ? file.name : 'Click to select PDF'}
                  </p>
                </label>
              </div>

              {/* Rotation Options */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Rotation Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rotation Angle
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[90, 180, 270].map((angle) => (
                        <button
                          key={angle}
                          onClick={() => setRotation(angle)}
                          className={`py-3 px-4 rounded-lg border-2 transition-all ${
                            rotation === angle
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          {angle}°
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pages to Rotate
                    </label>
                    <input
                      type="text"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      placeholder="all or 1,3,5-10"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter "all" or specific pages (e.g., "1,3,5-10")
                    </p>
                  </div>
                </div>
              </div>

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
                <Button onClick={handleRotate} disabled={loading || !file}>
                  {loading ? 'Rotating...' : 'Rotate PDF'}
                </Button>
              </div>

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-400">📌 Note</h3>
                <p className="text-sm text-gray-300">
                  This feature requires additional backend implementation.
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
