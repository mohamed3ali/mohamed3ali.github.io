import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import InputArea from '../../components/InputArea';
import Button from '../../components/Button';
import { toolsAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function MarkdownConverter() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('markdown-converter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) {
      setError('Please enter Markdown to convert');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.markdownConvert(input);
      if (response.data.success) {
        setOutput(response.data.result);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to convert Markdown');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <>
      <SEOHead toolSlug="markdown-converter" />

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
                {t('tools.markdownConverter')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.markdownConverter')}
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div>
                  <InputArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

[Link](https://example.com)

\`code\` and \`\`\`code blocks\`\`\``}
                    label="Markdown Input"
                    rows={15}
                  />
                </div>

                {/* Output Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {previewMode ? 'HTML Preview' : 'HTML Output'}
                    </label>
                    <button
                      onClick={() => setPreviewMode(!previewMode)}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {previewMode ? 'Show Code' : 'Show Preview'}
                    </button>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-h-[400px] overflow-auto">
                    {output ? (
                      previewMode ? (
                        <div 
                          className="prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: output }}
                        />
                      ) : (
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                          {output}
                        </pre>
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        HTML will appear here
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300"
                >
                  {error}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Button onClick={handleConvert} disabled={loading}>
                  {loading ? 'Converting...' : 'Convert to HTML'}
                </Button>
                <Button onClick={handleClear} variant="secondary">
                  Clear
                </Button>
              </div>
            </div>

            {/* Markdown Syntax Guide */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Markdown Syntax Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">Text Formatting</h3>
                  <div className="space-y-2 text-sm font-mono">
                    <div><span className="text-gray-400"># Heading 1</span></div>
                    <div><span className="text-gray-400">## Heading 2</span></div>
                    <div><span className="text-gray-400">**Bold**</span></div>
                    <div><span className="text-gray-400">*Italic*</span></div>
                    <div><span className="text-gray-400">`Code`</span></div>
                  </div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-purple-400">Lists & Links</h3>
                  <div className="space-y-2 text-sm font-mono">
                    <div><span className="text-gray-400">- List item</span></div>
                    <div><span className="text-gray-400">1. Numbered item</span></div>
                    <div><span className="text-gray-400">[Link](url)</span></div>
                    <div><span className="text-gray-400">![Image](url)</span></div>
                    <div><span className="text-gray-400">&gt; Quote</span></div>
                  </div>
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
