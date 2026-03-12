const express = require('express');
const router = express.Router();
const multer = require('multer');
const toolsController = require('../controllers/toolsController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Developer Tools
router.post('/json-format', toolsController.jsonFormat);
router.post('/json-minify', toolsController.jsonMinify);
router.post('/jwt-decode', toolsController.jwtDecode);
router.post('/base64-encode', toolsController.base64Encode);
router.post('/base64-decode', toolsController.base64Decode);
router.post('/uuid-generate', toolsController.uuidGenerate);
router.post('/password-generate', toolsController.passwordGenerate);
router.post('/url-encode', toolsController.urlEncode);
router.post('/url-decode', toolsController.urlDecode);
router.post('/hash-generate', toolsController.hashGenerate);

// PDF Tools
router.post('/pdf-merge', upload.array('files'), toolsController.pdfMerge);
router.post('/pdf-split', upload.single('file'), toolsController.pdfSplit);
router.post('/pdf-compress', upload.single('file'), toolsController.pdfCompress);router.post('/pdf-to-text', upload.single('file'), toolsController.pdfToText);
router.post('/pdf-rotate', upload.single('file'), toolsController.pdfRotate);
router.post('/pdf-remove-pages', upload.single('file'), toolsController.pdfRemovePages);
router.post('/pdf-add-page-numbers', upload.single('file'), toolsController.pdfAddPageNumbers);
router.post('/pdf-watermark', upload.single('file'), toolsController.pdfWatermark);
router.post('/images-to-pdf', upload.array('files', 20), toolsController.imagesToPdf);
router.post('/pdf-to-images', upload.single('file'), toolsController.pdfToImages);
router.post('/pdf-to-word', upload.single('file'), toolsController.pdfToWord);
router.post('/word-to-pdf', upload.single('file'), toolsController.wordToPdf);
router.post('/pdf-to-excel', upload.single('file'), toolsController.pdfToExcel);
router.post('/excel-to-pdf', upload.single('file'), toolsController.excelToPdf);
// Image Tools
router.post('/image-compress', upload.single('file'), toolsController.imageCompress);
router.post('/image-resize', upload.single('file'), toolsController.imageResize);
router.post('/image-convert', upload.single('file'), toolsController.imageConvert);
router.post('/image-remove-bg', upload.single('file'), toolsController.imageRemoveBg);

// Text Tools
router.post('/text-case', toolsController.textCase);
router.post('/text-count', toolsController.textCount);
router.post('/text-reverse', toolsController.textReverse);
router.post('/text-slug', toolsController.textSlug);
router.post('/text-diff', toolsController.textDiff);

// Web Tools
router.post('/qr-generate', toolsController.qrGenerate);
router.post('/html-minify', toolsController.htmlMinify);
router.post('/css-minify', toolsController.cssMinify);
router.post('/js-minify', toolsController.jsMinify);
router.post('/markdown-convert', toolsController.markdownConvert);

module.exports = router;
