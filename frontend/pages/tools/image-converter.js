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

export default function ImageConverter() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('image-converter');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [convertedImage, setConvertedImage] = useState('');
  const [format, setFormat] = useState('png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formats = [
    { value: 'png', label: 'PNG', icon: '🖼️' },
    { value: 'jpeg', label: 'JPEG', icon: '📸' },
    { value: 'webp', label: 'WebP', icon: '🌐' },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setConvertedImage('');
      setError('');
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.imageConvert(file, format);
      if (response.data.success) {
        const base64 = response.data.result;
        setConvertedImage(`data:image/${format};base64,${base64}`);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to convert image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const link = document.createElement('a');
    link.href = convertedImage;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    link.download = `${baseName}.${format}`;
    link.click();
  };

  const handleClear = () => {
    setFile(null);
    setPreview('');
    setConvertedImage('');
    setError('');
  };

  return (
    <>
      <SEOHead toolSlug="image-converter" />

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
                {t('tools.imageConverter')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.imageConverter')}
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* File Upload */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 mb-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-lg font-semibold mb-2">Select Image</p>
                  <div className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
                    Browse Image
                  </div>
                </label>
                {file && (
                  <p className="mt-4 text-center text-gray-300">
                    Selected: <span className="text-blue-400">{file.name}</span>
                  </p>
                )}
              </div>

              {/* Format Selection */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Convert To</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {formats.map((fmt) => (
                      <button
                        key={fmt.value}
                        onClick={() => setFormat(fmt.value)}
                        className={`p-4 rounded-lg font-semibold transition-all duration-300 ${
                          format === fmt.value
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <div className="text-3xl mb-2">{fmt.icon}</div>
                        <div className="text-sm">{fmt.label}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Preview */}
              {(preview || convertedImage) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {preview && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Original Image</h3>
                      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                        <img
                          src={preview}
                          alt="Original"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {convertedImage && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Converted Image (.{format})</h3>
                      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                        <img
                          src={convertedImage}
                          alt="Converted"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
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

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={handleConvert} disabled={loading || !file}>
                  {loading ? 'Converting...' : 'Convert Image'}
                </Button>
                {convertedImage && (
                  <Button onClick={handleDownload} variant="secondary">
                    Download
                  </Button>
                )}
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>
            </div>

            {/* Format Info */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Format Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">🖼️</div>
                  <h3 className="text-lg font-semibold mb-2">PNG</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Lossless compression, supports transparency
                  </p>
                  <p className="text-xs text-gray-500">Best for: Graphics, logos, screenshots</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">📸</div>
                  <h3 className="text-lg font-semibold mb-2">JPEG</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Lossy compression, smaller file size
                  </p>
                  <p className="text-xs text-gray-500">Best for: Photos, complex images</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">🌐</div>
                  <h3 className="text-lg font-semibold mb-2">WebP</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Modern format, best compression
                  </p>
                  <p className="text-xs text-gray-500">Best for: Web images, all-purpose</p>
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
