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

export default function ImageCompressor() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('image-compressor');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [compressedImage, setCompressedImage] = useState('');
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError(t('messages.invalidFile'));
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setCompressedImage('');
      setStats(null);
      setError('');
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.imageCompress(file, quality);
      if (response.data.success) {
        const base64 = response.data.result;
        setCompressedImage(`data:image/${response.data.format};base64,${base64}`);
        setStats({
          originalSize: response.data.originalSize,
          compressedSize: response.data.compressedSize,
          savings: response.data.savings,
          format: response.data.format
        });
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to compress image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedImage) return;
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed-${file.name}`;
    link.click();
  };

  const handleClear = () => {
    setFile(null);
    setPreview('');
    setCompressedImage('');
    setStats(null);
    setError('');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <SEOHead toolSlug="image-compressor" />

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
                {t('tools.imageCompressor')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.imageCompressor')}
              </p>
            </div>

            {/* Tool Interface */}
            <div className="max-w-6xl mx-auto">
              {/* File Upload */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 mb-6">
                <div className="flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Choose Image
                  </label>
                  {file && (
                    <p className="mt-4 text-gray-300">
                      Selected: <span className="text-blue-400">{file.name}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Quality Slider */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6"
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Compression Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low Quality (Smaller)</span>
                    <span>High Quality (Larger)</span>
                  </div>
                </motion.div>
              )}

              {/* Preview */}
              {(preview || compressedImage) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Original */}
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

                  {/* Compressed */}
                  {compressedImage && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Compressed Image</h3>
                      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                        <img
                          src={compressedImage}
                          alt="Compressed"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stats */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-6 mb-6"
                >
                  <h3 className="text-lg font-semibold mb-4 text-center">Compression Results</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Original Size</p>
                      <p className="text-xl font-bold text-red-400">{formatBytes(stats.originalSize)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Compressed Size</p>
                      <p className="text-xl font-bold text-green-400">{formatBytes(stats.compressedSize)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Savings</p>
                      <p className="text-xl font-bold text-blue-400">{stats.savings}</p>
                    </div>
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

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={handleCompress}
                  disabled={loading || !file}
                >
                  {loading ? 'Compressing...' : 'Compress Image'}
                </Button>
                {compressedImage && (
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

            {/* Features */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
                  <p className="text-gray-400 text-sm">
                    Compress images instantly with optimized algorithms
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">🎨</div>
                  <h3 className="text-lg font-semibold mb-2">Quality Control</h3>
                  <p className="text-gray-400 text-sm">
                    Adjust compression level to balance size and quality
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">📱</div>
                  <h3 className="text-lg font-semibold mb-2">Multiple Formats</h3>
                  <p className="text-gray-400 text-sm">
                    Support for JPEG, PNG, WebP, and more formats
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
