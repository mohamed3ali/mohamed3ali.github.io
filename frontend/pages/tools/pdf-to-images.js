import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function PdfToImages() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('pdf-to-images');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(100);
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setImages([]);
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setImages([]);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);
      formData.append('quality', quality);

      const response = await fetch('http://localhost:5000/api/tools/pdf-to-images', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setImages(data.images);
      } else {
        let errorMsg = data.error || 'Conversion failed';
        if (data.note) {
          errorMsg += '\n\n' + data.note;
        }
        setError(errorMsg);
      }
    } catch (err) {
      setError('Failed to convert PDF to images: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imageData, pageNum, format) => {
    const link = document.createElement('a');
    link.href = `data:image/${format};base64,${imageData}`;
    link.download = `page-${pageNum}.${format}`;
    link.click();
  };

  const downloadAllImages = () => {
    images.forEach((image) => {
      downloadImage(image.data, image.page, image.format);
    });
  };

  return (
    <>
      <SEOHead toolSlug="pdf-to-images" />

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
                {t('tools.pdfToImages')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.pdfToImages')}
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
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-lg mb-2">
                    {file ? file.name : 'Click to select PDF file'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Each page will be converted to a separate image
                  </p>
                </label>
              </div>

              {/* Options */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Conversion Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Output Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="png">PNG (Best Quality)</option>
                      <option value="jpeg">JPEG (Smaller Size)</option>
                      <option value="webp">WebP (Modern)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quality: {quality}%
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="w-full"
                    />
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
                <Button onClick={handleConvert} disabled={loading || !file}>
                  {loading ? 'Converting...' : 'Convert to Images'}
                </Button>
                {images.length > 0 && (
                  <Button onClick={downloadAllImages} variant="secondary">
                    Download All Images
                  </Button>
                )}
              </div>

              {/* Display converted images */}
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Converted Images ({images.length} pages)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div
                        key={image.page}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                      >
                        <img
                          src={`data:image/${image.format};base64,${image.data}`}
                          alt={`Page ${image.page}`}
                          className="w-full h-auto rounded mb-3"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            Page {image.page}
                          </span>
                          <button
                            onClick={() => downloadImage(image.data, image.page, image.format)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-400">📌 Note</h3>
                <p className="text-sm text-gray-300">
                  Large PDFs are limited to 20 pages. Each page is rendered at high resolution.
                  This feature requires GraphicsMagick or ImageMagick on the server.
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
