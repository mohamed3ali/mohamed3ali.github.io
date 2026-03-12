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

export default function PasswordGenerator() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('password-generator');
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setCopied(false);
    
    try {
      const response = await toolsAPI.passwordGenerate({
        length,
        ...options
      });
      if (response.data.success) {
        setPassword(response.data.result);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate password');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const getStrength = () => {
    if (!password) return { text: '', color: '', width: '0%' };
    
    let strength = 0;
    if (password.length >= 12) strength += 25;
    if (password.length >= 16) strength += 25;
    if (/[a-z]/.test(password)) strength += 12.5;
    if (/[A-Z]/.test(password)) strength += 12.5;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
    
    if (strength < 40) return { text: 'Weak', color: 'bg-red-500', width: '25%' };
    if (strength < 70) return { text: 'Medium', color: 'bg-yellow-500', width: '50%' };
    if (strength < 90) return { text: 'Strong', color: 'bg-green-500', width: '75%' };
    return { text: 'Very Strong', color: 'bg-green-600', width: '100%' };
  };

  const strength = getStrength();

  return (
    <>
      <SEOHead toolSlug="password-generator" />

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
                {t('tools.passwordGenerator')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.passwordGenerator')}
              </p>
            </div>

            {/* Tool Interface */}
            <div className="max-w-4xl mx-auto">
              {/* Password Display */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-grow bg-gray-900 rounded-lg p-4 font-mono text-xl break-all min-h-[60px] flex items-center">
                    {password || <span className="text-gray-500">Click generate to create password</span>}
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="secondary"
                    disabled={!password}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </Button>
                </div>
                
                {/* Strength Indicator */}
                {password && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Password Strength</span>
                      <span className={`font-semibold ${
                        strength.text === 'Weak' ? 'text-red-400' :
                        strength.text === 'Medium' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {strength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6">
                {/* Length Slider */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password Length: {length}
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    step="1"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>8</span>
                    <span>64</span>
                  </div>
                </div>

                {/* Character Options */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeUppercase}
                      onChange={() => handleOptionChange('includeUppercase')}
                      className="w-5 h-5 rounded accent-blue-500"
                    />
                    <span className="text-gray-300">Uppercase Letters (A-Z)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeLowercase}
                      onChange={() => handleOptionChange('includeLowercase')}
                      className="w-5 h-5 rounded accent-blue-500"
                    />
                    <span className="text-gray-300">Lowercase Letters (a-z)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeNumbers}
                      onChange={() => handleOptionChange('includeNumbers')}
                      className="w-5 h-5 rounded accent-blue-500"
                    />
                    <span className="text-gray-300">Numbers (0-9)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeSymbols}
                      onChange={() => handleOptionChange('includeSymbols')}
                      className="w-5 h-5 rounded accent-blue-500"
                    />
                    <span className="text-gray-300">Symbols (!@#$%^&*)</span>
                  </label>
                </div>
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

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-12"
                >
                  {loading ? 'Generating...' : 'Generate Password'}
                </Button>
              </div>
            </div>

            {/* Security Tips */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Password Security Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-3">🔒</div>
                  <h3 className="text-lg font-semibold mb-2">Use Unique Passwords</h3>
                  <p className="text-gray-400 text-sm">
                    Never reuse passwords across different accounts
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-purple-400 text-2xl mb-3">📏</div>
                  <h3 className="text-lg font-semibold mb-2">Minimum 12 Characters</h3>
                  <p className="text-gray-400 text-sm">
                    Longer passwords are exponentially harder to crack
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                  <div className="text-green-400 text-2xl mb-3">🔐</div>
                  <h3 className="text-lg font-semibold mb-2">Use a Password Manager</h3>
                  <p className="text-gray-400 text-sm">
                    Store passwords securely with encryption
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
