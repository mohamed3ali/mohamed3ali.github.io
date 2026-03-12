import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import InputArea from '../../components/InputArea';
import OutputArea from '../../components/OutputArea';
import Button from '../../components/Button';
import { toolsAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function CaseConverter() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('case-converter');
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const caseTypes = [
    { value: 'upper', label: 'UPPER CASE', example: 'HELLO WORLD' },
    { value: 'lower', label: 'lower case', example: 'hello world' },
    { value: 'title', label: 'Title Case', example: 'Hello World' },
    { value: 'sentence', label: 'Sentence case', example: 'Hello world' },
    { value: 'camel', label: 'camelCase', example: 'helloWorld' },
    { value: 'snake', label: 'snake_case', example: 'hello_world' },
    { value: 'kebab', label: 'kebab-case', example: 'hello-world' },
    { value: 'toggle', label: 'tOGGLE cASE', example: 'hELLO wORLD' },
  ];

  const handleConvert = async (caseType) => {
    if (!input.trim()) {
      setError('Please enter text to convert');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await toolsAPI.textCase(input, caseType);
      if (response.data.success) {
        setOutputs(prev => ({
          ...prev,
          [caseType]: response.data.result
        }));
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to convert text');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertAll = async () => {
    if (!input.trim()) {
      setError('Please enter text to convert');
      return;
    }

    setLoading(true);
    setError('');
    const results = {};
    
    try {
      for (const type of caseTypes) {
        const response = await toolsAPI.textCase(input, type.value);
        if (response.data.success) {
          results[type.value] = response.data.result;
        }
      }
      setOutputs(results);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to convert text');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setInput('');
    setOutputs({});
    setError('');
  };

  return (
    <>
      <SEOHead toolSlug="case-converter" />

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
                {t('tools.caseConverter')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.caseConverter')}
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Input */}
              <div className="mb-6">
                <InputArea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text to convert..."
                  label="Input Text"
                  rows={6}
                />
              </div>

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

              {/* Convert All Button */}
              <div className="flex justify-center mb-8">
                <Button onClick={handleConvertAll} disabled={loading}>
                  {loading ? 'Converting...' : 'Convert to All Cases'}
                </Button>
                <Button onClick={handleClear} variant="secondary" className="ml-4">
                  Clear
                </Button>
              </div>

              {/* Case Type Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {caseTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleConvert(type.value)}
                    disabled={loading}
                    className="bg-gray-800/50 hover:bg-gray-700/50 p-4 rounded-lg border border-gray-700 transition-all duration-300 text-left disabled:opacity-50"
                  >
                    <h3 className="font-semibold mb-1">{type.label}</h3>
                    <p className="text-xs text-gray-400">{type.example}</p>
                  </button>
                ))}
              </div>

              {/* Output Results */}
              {Object.keys(outputs).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">Results</h3>
                  {Object.entries(outputs).map(([caseType, result]) => {
                    const type = caseTypes.find(t => t.value === caseType);
                    return (
                      <div
                        key={caseType}
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-semibold text-gray-400">{type?.label}</h4>
                          <button
                            onClick={() => handleCopy(result)}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <div className="bg-gray-900 rounded p-3 text-sm break-words">
                          {result}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Use Cases */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Common Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2 text-blue-400">Variable Names</h3>
                  <p className="text-gray-400 text-sm">camelCase, snake_case</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2 text-purple-400">URLs</h3>
                  <p className="text-gray-400 text-sm">kebab-case, lower case</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2 text-green-400">Titles</h3>
                  <p className="text-gray-400 text-sm">Title Case, Sentence case</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2 text-yellow-400">Emphasis</h3>
                  <p className="text-gray-400 text-sm">UPPER CASE</p>
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
