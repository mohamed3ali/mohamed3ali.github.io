import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Tool API methods
export const toolsAPI = {
  // Developer Tools
  jsonFormat: (data) => api.post('/tools/json-format', { data }),
  jsonMinify: (data) => api.post('/tools/json-minify', { data }),
  jwtDecode: (token) => api.post('/tools/jwt-decode', { token }),
  base64Encode: (data) => api.post('/tools/base64-encode', { data }),
  base64Decode: (data) => api.post('/tools/base64-decode', { data }),
  uuidGenerate: (count = 1) => api.post('/tools/uuid-generate', { count }),
  passwordGenerate: (options) => api.post('/tools/password-generate', options),
  urlEncode: (data) => api.post('/tools/url-encode', { data }),
  urlDecode: (data) => api.post('/tools/url-decode', { data }),
  hashGenerate: (data, algorithm = 'sha256') => api.post('/tools/hash-generate', { data, algorithm }),
  
  // PDF Tools
  pdfMerge: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return api.post('/tools/pdf-merge', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });
  },
  pdfSplit: (file, pages) => {
    const formData = new FormData();
    formData.append('file', file);
    if (pages) formData.append('pages', pages);
    return api.post('/tools/pdf-split', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });
  },
  pdfCompress: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/tools/pdf-compress', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });
  },
  
  // Image Tools
  imageCompress: (file, quality = 80) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);
    return api.post('/tools/image-compress', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });
  },
  imageResize: (file, width, height) => {
    const formData = new FormData();
    formData.append('file', file);
    if (width) formData.append('width', width);
    if (height) formData.append('height', height);
    return api.post('/tools/image-resize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });
  },
  imageConvert: (file, format) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    return api.post('/tools/image-convert', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });
  },
  imageRemoveBg: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/tools/image-remove-bg', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });
  },
  
  // Text Tools
  textCase: (data, caseType) => api.post('/tools/text-case', { data, caseType }),
  textCount: (data) => api.post('/tools/text-count', { data }),
  textReverse: (data) => api.post('/tools/text-reverse', { data }),
  textSlug: (data) => api.post('/tools/text-slug', { data }),
  textDiff: (text1, text2) => api.post('/tools/text-diff', { text1, text2 }),
  
  // Web Tools
  qrGenerate: (data, size = 300) => api.post('/tools/qr-generate', { data, size }),
  htmlMinifier: (data) => api.post('/tools/html-minify', { data }),
  cssMinifier: (data) => api.post('/tools/css-minify', { data }),
  jsMinifier: (data) => api.post('/tools/js-minify', { data }),
  markdownConvert: (data) => api.post('/tools/markdown-convert', { data }),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
