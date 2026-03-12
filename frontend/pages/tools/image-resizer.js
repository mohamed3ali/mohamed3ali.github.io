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

export default function ImageResizer() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('image-resizer');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [resizedImage, setResizedImage] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maintainAspect, setMaintainAspect] = useState(true);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResizedImage('');
      setError('');
    }
  };

  const handleResize = async () => {
    if (!file) {
      setError('Please select an image file');
      return;
    }

    if (!width && !height) {
      setError('Please specify width or height');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.imageResize(file, width, height);
      if (response.data.success) {
        const base64 = response.data.result;
        setResizedImage(`data:image/${response.data.format};base64,${base64}`);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resize image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resizedImage) return;
    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `resized-${file.name}`;
    link.click();
  };

  const handleClear = () => {
    setFile(null);
    setPreview('');
    setResizedImage('');
    setWidth('');
    setHeight('');
    setError('');
  };

  return (
    <>
      <SEOHead toolSlug="image-resizer" />

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
                {t('tools.imageResizer')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.imageResizer')}
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

              {/* Resize Options */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Resize Dimensions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="Enter width"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Enter height"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    💡 Leave one dimension empty to auto-calculate and maintain aspect ratio
                  </p>
                </motion.div>
              )}

              {/* Preview */}
              {(preview || resizedImage) && (
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

                  {resizedImage && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Resized Image</h3>
                      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                        <img
                          src={resizedImage}
                          alt="Resized"
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
                <Button onClick={handleResize} disabled={loading || !file}>
                  {loading ? 'Resizing...' : 'Resize Image'}
                </Button>
                {resizedImage && (
                  <Button onClick={handleDownload} variant="secondary">
                    Download
                  </Button>
                )}
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>
            </div>

            {/* Common Dimensions */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Common Dimensions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Instagram Post', size: '1080x1080' },
                  { name: 'Twitter Header', size: '1500x500' },
                  { name: 'Facebook Cover', size: '820x312' },
                  { name: 'YouTube Thumbnail', size: '1280x720' },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      const [w, h] = preset.size.split('x');
                      setWidth(w);
                      setHeight(h);
                    }}
                    className="bg-gray-800/50 hover:bg-gray-700/50 p-4 rounded-lg border border-gray-700 transition-colors"
                  >
                    <p className="font-semibold text-sm mb-1">{preset.name}</p>
                    <p className="text-xs text-gray-400">{preset.size}px</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}
