'use client';

import { motion } from 'framer-motion';
import Button from './Button';
import { useState } from 'react';
import { useTranslation } from '../translations';

export default function OutputArea({ 
  title,
  label, // alias for title
  result,
  value, // alias for result
  loading = false,
  error = null,
  outputType = 'text', // 'text', 'code', 'file', 'image'
  language = 'javascript', // for code output
  downloadable = false,
  downloadFileName = 'result.txt',
  copyable = true,
  onDownload,
  onCopy,
  rows, // for textarea compatibility (ignored)
}) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  
  // Use aliases if main props not provided
  const displayTitle = title || label || t('common.result');
  const displayResult = result || value;

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else if (displayResult) {
      navigator.clipboard.writeText(typeof displayResult === 'string' ? displayResult : JSON.stringify(displayResult, null, 2));
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (displayResult) {
      const blob = new Blob([typeof displayResult === 'string' ? displayResult : JSON.stringify(displayResult, null, 2)], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {displayTitle}
        </h2>
        
        {/* Action Buttons */}
        {(displayResult && !loading && !error) && (
          <div className="flex gap-2">
            {copyable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                icon={
                  copied ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )
                }
              >
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
            )}
            {downloadable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                }
              >
                {t('common.download')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400">{t('common.processing')}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-400 mb-1">{t('common.error')}</h3>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!displayResult && !loading && !error) && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-600">
            <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>{t('common.yourResult')}</p>
          </div>
        )}

        {/* Result Display */}
        {(displayResult && !loading && !error) && (
          <>
            {/* Text Output */}
            {outputType === 'text' && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <pre className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200 font-mono text-sm auto-direction" dir="auto">
                  {typeof displayResult === 'string' ? displayResult : JSON.stringify(displayResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Code Output */}
            {outputType === 'code' && (
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="text-xs text-gray-400 uppercase font-mono">{language}</span>
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm text-gray-100 font-mono auto-direction" dir="auto">
                    {typeof displayResult === 'string' ? displayResult : JSON.stringify(displayResult, null, 2)}
                  </code>
                </pre>
              </div>
            )}

            {/* Image Output */}
            {outputType === 'image' && (
              <div className="flex justify-center">
                <img src={displayResult} alt="Result" className="max-w-full rounded-lg border border-gray-200 dark:border-gray-700" />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
