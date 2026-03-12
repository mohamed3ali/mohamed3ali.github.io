'use client';

import { motion } from 'framer-motion';
import Button from './Button';
import { useTranslation } from '../translations';

export default function InputArea({ 
  title,
  description,
  inputType = 'text', // 'text', 'textarea', 'file', 'url'
  placeholder,
  value,
  onChange,
  onSubmit,
  buttonText = null,
  accept, // for file input
  multiple = false, // for file input
  maxLength,
  rows = 6,
  additionalOptions = null,
}) {
  const { t } = useTranslation();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text Input */}
          {inputType === 'text' && (
            <input
              type="text"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              maxLength={maxLength}
              className="input-field auto-direction"
              dir="auto"
            />
          )}

          {/* Textarea Input */}
          {inputType === 'textarea' && (
            <div className="relative">
              <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                className="input-field resize-none auto-direction"
                dir="auto"
              />
              {maxLength && (
                <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                  {value?.length || 0} / {maxLength}
                </div>
              )}
            </div>
          )}

          {/* URL Input */}
          {inputType === 'url' && (
            <div className="flex gap-2">
              <input
                type="url"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "https://example.com"}
                className="input-field"
              />
            </div>
          )}

          {/* File Input */}
          {inputType === 'file' && (
            <div className="relative">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-300 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">{multiple ? t('common.browseFiles') : t('common.browse')}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {accept || 'Any file type'}
                  </p>
                </div>
                <input
                  type="file"
                  onChange={onChange}
                  accept={accept}
                  multiple={multiple}
                  className="hidden"
                />
              </label>
              {value && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {value.name || `${value.length} file(s)`}
                </div>
              )}
            </div>
          )}

          {/* Additional Options */}
          {additionalOptions && (
            <div className="pt-2">
              {additionalOptions}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          >
            {buttonText || t('common.process')}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
