import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { getSeoData } from '../../data/seoMetadata';
import { useTranslation } from '../../translations';

export default function ExcelToPdf() {
  const { language, t } = useTranslation();
  const isArabic = language === 'ar';
  const seoData = getSeoData('excel-to-pdf');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid Excel file (.xls or .xlsx)');
      setFile(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select an Excel file');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/tools/excel-to-pdf', {
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
        a.download = data.filename || 'converted.pdf';
        a.click();
      } else {
        let errorMsg = data.error || 'Conversion failed';
        if (data.note) {
          errorMsg += '\n\n' + data.note;
        }
        setError(errorMsg);
      }
    } catch (err) {
      setError('Failed to convert Excel to PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead toolSlug="excel-to-pdf" />

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
                {t('tools.excelToPdf')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('descriptions.excelToPdf')}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-dashed border-gray-700 rounded-lg p-8 text-center mb-6">
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="excel-upload"
                />
                <label htmlFor="excel-upload" className="cursor-pointer">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-lg mb-2">
                    {file ? file.name : 'Click to select Excel file'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports .xls and .xlsx formats
                  </p>
                </label>
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
                  {loading ? 'Converting...' : 'Convert to PDF'}
                </Button>
              </div>

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-400">📌 Note</h3>
                <p className="text-sm text-gray-300">
                  This feature requires additional backend implementation with Excel rendering libraries.
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
