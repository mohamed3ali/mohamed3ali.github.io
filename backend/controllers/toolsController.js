const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const sharp = require('sharp');
const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const { minify: htmlMinifier } = require('html-minifier');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');
const { marked } = require('marked');
const Diff = require('diff');
const slugify = require('slugify');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const PDFDocument2 = require('pdfkit');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const XLSX = require('xlsx');
const { fromPath } = require('pdf2pic');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);
const fs = require('fs');
const path = require('path');
const os = require('os');

// Helper function to parse PDF without warnings
const parsePdfSilently = async (buffer) => {
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;
  
  // Suppress all console output during parsing
  console.warn = () => {};
  console.error = () => {};
  console.log = (...args) => {
    // Only suppress "Warning:" messages
    const msg = args.join(' ');
    if (msg.includes('Warning:') || msg.includes('TT:')) {
      return;
    }
    originalLog(...args);
  };
  
  try {
    return await pdfParse(buffer);
  } finally {
    // Restore console methods
    console.warn = originalWarn;
    console.error = originalError;
    console.log = originalLog;
  }
};

// ==================== DEVELOPER TOOLS ====================

// JSON Formatter
exports.jsonFormat = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const parsed = JSON.parse(data);
    const formatted = JSON.stringify(parsed, null, 2);
    
    res.json({ 
      success: true, 
      result: formatted 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: 'Invalid JSON format',
      message: error.message
    });
  }
};

// JSON Minify
exports.jsonMinify = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const parsed = JSON.parse(data);
    const minified = JSON.stringify(parsed);
    
    res.json({ 
      success: true, 
      result: minified 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: 'Invalid JSON format',
      message: error.message
    });
  }
};

// JWT Decoder
exports.jwtDecode = (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid JWT token' 
      });
    }
    
    res.json({ 
      success: true, 
      result: {
        header: decoded.header,
        payload: decoded.payload
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: 'Failed to decode JWT',
      message: error.message
    });
  }
};

// Base64 Encode
exports.base64Encode = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const encoded = Buffer.from(data).toString('base64');
    
    res.json({ 
      success: true, 
      result: encoded 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Encoding failed',
      message: error.message
    });
  }
};

// Base64 Decode
exports.base64Decode = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const decoded = Buffer.from(data, 'base64').toString('utf-8');
    
    res.json({ 
      success: true, 
      result: decoded 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: 'Invalid Base64 string',
      message: error.message
    });
  }
};

// UUID Generator
exports.uuidGenerate = (req, res) => {
  try {
    const { count = 1 } = req.body;
    const uuids = [];
    
    for (let i = 0; i < Math.min(count, 100); i++) {
      uuids.push(uuidv4());
    }
    
    res.json({ 
      success: true, 
      result: count === 1 ? uuids[0] : uuids 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'UUID generation failed',
      message: error.message
    });
  }
};

// Password Generator
exports.passwordGenerate = (req, res) => {
  try {
    const { 
      length = 16, 
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true 
    } = req.body;
    
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (charset === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'At least one character type must be selected' 
      });
    }
    
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    
    res.json({ 
      success: true, 
      result: password 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Password generation failed',
      message: error.message
    });
  }
};

// URL Encode
exports.urlEncode = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const encoded = encodeURIComponent(data);
    
    res.json({ 
      success: true, 
      result: encoded 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Encoding failed',
      message: error.message
    });
  }
};

// URL Decode
exports.urlDecode = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const decoded = decodeURIComponent(data);
    
    res.json({ 
      success: true, 
      result: decoded 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Decoding failed',
      message: error.message
    });
  }
};

// Hash Generator
exports.hashGenerate = (req, res) => {
  try {
    const { data, algorithm = 'sha256' } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const validAlgorithms = ['md5', 'sha1', 'sha256', 'sha512'];
    
    if (!validAlgorithms.includes(algorithm.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid algorithm. Use: md5, sha1, sha256, or sha512' 
      });
    }

    const hash = crypto.createHash(algorithm).update(data).digest('hex');
    
    res.json({ 
      success: true, 
      result: hash,
      algorithm: algorithm
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Hash generation failed',
      message: error.message
    });
  }
};

// ==================== PDF TOOLS ====================

// PDF Merge
exports.pdfMerge = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'At least 2 PDF files required' 
      });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdf = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    
    res.json({ 
      success: true, 
      result: Buffer.from(mergedPdfBytes).toString('base64'),
      filename: 'merged.pdf'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'PDF merge failed',
      message: error.message
    });
  }
};

// PDF Split
exports.pdfSplit = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    const { pages } = req.body;
    const pdf = await PDFDocument.load(req.file.buffer);
    const totalPages = pdf.getPageCount();
    
    let pageNumbers = [];
    if (pages) {
      const ranges = pages.split(',');
      for (const range of ranges) {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= totalPages) pageNumbers.push(i - 1);
          }
        } else {
          const pageNum = Number(range);
          if (pageNum > 0 && pageNum <= totalPages) pageNumbers.push(pageNum - 1);
        }
      }
    } else {
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdf, pageNumbers);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    
    res.json({ 
      success: true, 
      result: Buffer.from(pdfBytes).toString('base64'),
      filename: 'split.pdf',
      pageCount: pageNumbers.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'PDF split failed',
      message: error.message
    });
  }
};

// PDF Compress
exports.pdfCompress = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    const pdf = await PDFDocument.load(req.file.buffer);
    
    // Enable compression with optimized settings
    const pdfBytes = await pdf.save({ 
      useObjectStreams: true,  // Enable object streams for better compression
      addDefaultPage: false,   // Don't add unnecessary pages
      objectsPerTick: 50       // Process in batches for better compression
    });
    
    const originalSize = req.file.buffer.length;
    const compressedSize = pdfBytes.length;
    
    // If compression actually increased size, return original
    if (compressedSize >= originalSize) {
      res.json({ 
        success: true, 
        result: req.file.buffer.toString('base64'),
        filename: 'compressed.pdf',
        originalSize: originalSize,
        compressedSize: originalSize,
        savings: '0.00%',
        message: 'PDF is already optimized - no compression applied'
      });
    } else {
      const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
      
      res.json({ 
        success: true, 
        result: Buffer.from(pdfBytes).toString('base64'),
        filename: 'compressed.pdf',
        originalSize: originalSize,
        compressedSize: compressedSize,
        savings: `${savings}%`
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'PDF compression failed',
      message: error.message
    });
  }
};

// PDF to Text
exports.pdfToText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    const data = await parsePdfSilently(req.file.buffer);
    
    res.json({ 
      success: true, 
      result: data.text,
      pages: data.numpages,
      info: data.info
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'PDF text extraction failed',
      message: error.message
    });
  }
};

// Rotate PDF
exports.pdfRotate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    const { rotation = 90, pages = 'all' } = req.body;
    const pdf = await PDFDocument.load(req.file.buffer);
    const totalPages = pdf.getPageCount();
    const pdfPages = pdf.getPages();
    
    // Parse which pages to rotate
    let pageNumbers = [];
    if (pages === 'all') {
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      const ranges = pages.split(',');
      for (const range of ranges) {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= totalPages) pageNumbers.push(i - 1);
          }
        } else {
          const pageNum = Number(range);
          if (pageNum > 0 && pageNum <= totalPages) pageNumbers.push(pageNum - 1);
        }
      }
    }

    // Rotate specified pages
    const rotationDegrees = parseInt(rotation);
    for (const pageIndex of pageNumbers) {
      const page = pdfPages[pageIndex];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotationDegrees));
    }

    const pdfBytes = await pdf.save();
    
    res.json({ 
      success: true, 
      result: Buffer.from(pdfBytes).toString('base64'),
      filename: 'rotated.pdf',
      rotatedPages: pageNumbers.length,
      rotation: rotationDegrees
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'PDF rotation failed',
      message: error.message
    });
  }
};

// Remove PDF Pages
exports.pdfRemovePages = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    const { pages } = req.body;
    if (!pages) {
      return res.status(400).json({ 
        success: false, 
        error: 'No pages specified for removal' 
      });
    }

    const pdf = await PDFDocument.load(req.file.buffer);
    const totalPages = pdf.getPageCount();
    
    // Parse pages to remove
    let pagesToRemove = [];
    const ranges = pages.split(',');
    for (const range of ranges) {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= totalPages) pagesToRemove.push(i - 1);
        }
      } else {
        const pageNum = Number(range);
        if (pageNum > 0 && pageNum <= totalPages) pagesToRemove.push(pageNum - 1);
      }
    }

    // Sort in descending order to remove from end first
    pagesToRemove.sort((a, b) => b - a);
    
    // Remove pages
    for (const pageIndex of pagesToRemove) {
      pdf.removePage(pageIndex);
    }

    const pdfBytes = await pdf.save();
    
    res.json({ 
      success: true, 
      result: Buffer.from(pdfBytes).toString('base64'),
      filename: 'removed-pages.pdf',
      removedPages: pagesToRemove.length,
      remainingPages: totalPages - pagesToRemove.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Page removal failed',
      message: error.message
    });
  }
};

// Add Page Numbers to PDF
exports.pdfAddPageNumbers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    const { position = 'bottom-center', format = 'standard' } = req.body;
    const pdf = await PDFDocument.load(req.file.buffer);
    const pages = pdf.getPages();
    const totalPages = pages.length;

    // Embed a font that supports Arabic
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      
      let pageNumberText;
      switch (format) {
        case 'page-of':
          pageNumberText = `Page ${i + 1} of ${totalPages}`;
          break;
        case 'roman':
          pageNumberText = arabicToRoman(i + 1);
          break;
        case 'roman-small':
          pageNumberText = arabicToRoman(i + 1).toLowerCase();
          break;
        default:
          pageNumberText = `${i + 1}`;
      }

      // Calculate position
      let x, y;
      const fontSize = 12;
      const textWidth = font.widthOfTextAtSize(pageNumberText, fontSize);

      switch (position) {
        case 'top-left':
          x = 40;
          y = height - 40;
          break;
        case 'top-center':
          x = (width - textWidth) / 2;
          y = height - 40;
          break;
        case 'top-right':
          x = width - textWidth - 40;
          y = height - 40;
          break;
        case 'bottom-left':
          x = 40;
          y = 40;
          break;
        case 'bottom-center':
          x = (width - textWidth) / 2;
          y = 40;
          break;
        case 'bottom-right':
          x = width - textWidth - 40;
          y = 40;
          break;
        default:
          x = (width - textWidth) / 2;
          y = 40;
      }

      page.drawText(pageNumberText, {
        x,
        y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0)
      });
    }

    const pdfBytes = await pdf.save();
    
    res.json({ 
      success: true, 
      result: Buffer.from(pdfBytes).toString('base64'),
      filename: 'numbered.pdf',
      totalPages: totalPages
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Adding page numbers failed',
      message: error.message
    });
  }
};

// Helper function for Roman numerals
function arabicToRoman(num) {
  const lookup = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90,
    L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let roman = '';
  for (let key in lookup) {
    while (num >= lookup[key]) {
      roman += key;
      num -= lookup[key];
    }
  }
  return roman;
}

// PDF Watermark
exports.pdfWatermark = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    const { watermarkText = 'WATERMARK', opacity = 50 } = req.body;
    const pdf = await PDFDocument.load(req.file.buffer);
    const pages = pdf.getPages();

    // Embed standard font
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    // Convert opacity from percentage (0-100) to decimal (0-1)
    const opacityDecimal = parseFloat(opacity) / 100;

    for (const page of pages) {
      const { width, height } = page.getSize();
      
      // Draw watermark diagonally across page
      page.drawText(watermarkText, {
        x: width / 4,
        y: height / 2,
        size: 50,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: opacityDecimal,
        rotate: degrees(45)
      });
    }

    const pdfBytes = await pdf.save();
    
    res.json({ 
      success: true, 
      result: Buffer.from(pdfBytes).toString('base64'),
      filename: 'watermarked.pdf',
      pagesWatermarked: pages.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Watermark addition failed',
      message: error.message
    });
  }
};

// Images to PDF
exports.imagesToPdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image files provided' 
      });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      let image;
      
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        image = await pdfDoc.embedJpg(file.buffer);
      } else if (file.mimetype === 'image/png') {
        image = await pdfDoc.embedPng(file.buffer);
      } else {
        // Convert other formats to PNG using sharp
        const pngBuffer = await sharp(file.buffer).png().toBuffer();
        image = await pdfDoc.embedPng(pngBuffer);
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    
    res.json({ 
      success: true, 
      result: Buffer.from(pdfBytes).toString('base64'),
      filename: 'images-combined.pdf',
      imageCount: req.files.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Images to PDF conversion failed',
      message: error.message
    });
  }
};

// PDF to Images
exports.pdfToImages = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    const { format = 'png', quality = 100 } = req.body;

    // Save PDF temporarily
    const tempDir = os.tmpdir();
    const tempPdfPath = path.join(tempDir, `temp_${Date.now()}.pdf`);
    fs.writeFileSync(tempPdfPath, req.file.buffer);

    try {
      // Get PDF info to know how many pages
      const pdfData = await parsePdfSilently(req.file.buffer);
      const numPages = pdfData.numpages;

      console.log(`Converting PDF with ${numPages} pages to ${format}`);
      console.log(`PDF saved at: ${tempPdfPath}`);

      // ImageMagick executable path
      const magickExe = 'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe';
      
      if (!fs.existsSync(magickExe)) {
        throw new Error('ImageMagick not found at expected location');
      }

      console.log(`Using ImageMagick at: ${magickExe}`);
      
      // Convert all pages using ImageMagick directly
      const images = [];
      for (let i = 0; i < Math.min(numPages, 20); i++) { // Limit to 20 pages
        const pageNum = i + 1;
        try {
          console.log(`Converting page ${pageNum}...`);
          
          // Output file path
          const outputPath = path.join(tempDir, `page_${Date.now()}_${pageNum}.${format.toLowerCase()}`);
          
          // ImageMagick 7 command: magick input.pdf[page] output.png
          // Using "magick" prefix for ImageMagick 7
          const command = `"${magickExe}" -density 200 -quality ${quality} "${tempPdfPath}[${i}]" "${outputPath}"`;
          console.log(`Running command: ${command}`);
          
          // Execute ImageMagick
          const { stdout, stderr } = await execPromise(command);
          if (stderr && !stderr.includes('Warning')) {
            console.log('ImageMagick stderr:', stderr);
          }
          
          // Check if file was created
          if (fs.existsSync(outputPath)) {
            // Read the converted image file and convert to base64
            const imageBuffer = fs.readFileSync(outputPath);
            const base64Data = imageBuffer.toString('base64');
            
            images.push({
              page: pageNum,
              data: base64Data,
              format: format.toLowerCase()
            });
            
            // Clean up the temporary image file
            fs.unlinkSync(outputPath);
            console.log(`Page ${pageNum} converted successfully`);
          } else {
            console.error(`Page ${pageNum}: File not created at ${outputPath}`);
          }
        } catch (pageError) {
          console.error(`Error converting page ${pageNum}:`, pageError.message);
          
          // Check if it's a Ghostscript error
          if (pageError.message && (
            pageError.message.includes('gswin') || 
            pageError.message.includes('Ghostscript') ||
            pageError.message.includes('PDFDelegateFailed')
          )) {
            throw new Error('Ghostscript is required but not installed. Download and install from: https://ghostscript.com/releases/gsdnld.html');
          }
        }
      }

      // Clean up temp PDF file
      if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }

      if (images.length === 0) {
        console.error('No pages were converted successfully');
        return res.status(500).json({
          success: false,
          error: 'Failed to convert any pages',
          note: 'ImageMagick requires Ghostscript. Please install Ghostscript from https://ghostscript.com/releases/gsdnld.html and add it to PATH, then restart the server.'
        });
      }

      console.log(`Successfully converted ${images.length} pages`);
      res.json({ 
        success: true, 
        images: images,
        totalPages: numPages,
        convertedPages: images.length,
        format: format.toLowerCase()
      });
    } finally {
      // Cleanup: Remove temp file if it still exists
      if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }
    }
  } catch (error) {
    console.error('PDF to Images Error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      error: 'PDF to images conversion failed',
      message: error.message,
      note: 'This feature requires Ghostscript. Download and install from https://ghostscript.com/releases/gsdnld.html (get the Windows x64 version), restart your computer, then restart the server.'
    });
  }
};

// PDF to Word
exports.pdfToWord = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    // Extract text from PDF
    const pdfData = await parsePdfSilently(req.file.buffer);
    const extractedText = pdfData.text;

    // Split text into paragraphs
    const paragraphs = extractedText.split('\n').filter(line => line.trim());
    
    // Create paragraphs array
    const docParagraphs = paragraphs.map(text => 
      new Paragraph({
        children: [
          new TextRun({
            text: text.trim(),
            size: 24 // 12pt font
          })
        ],
        spacing: {
          after: 200
        }
      })
    );

    // Create Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: docParagraphs.length > 0 ? docParagraphs : [
          new Paragraph({
            children: [
              new TextRun('No text content found in PDF')
            ]
          })
        ]
      }]
    });

    // Generate Word file buffer
    const buffer = await Packer.toBuffer(doc);
    
    res.json({ 
      success: true, 
      result: buffer.toString('base64'),
      filename: 'converted.docx',
      pages: pdfData.numpages,
      note: 'Basic conversion - formatting may not be preserved'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'PDF to Word conversion failed',
      message: error.message
    });
  }
};

// Word to PDF
exports.wordToPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No Word file provided' 
      });
    }

    // Convert Word to HTML using mammoth with style mapping
    const htmlResult = await mammoth.convertToHtml({ 
      buffer: req.file.buffer,
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em"
      ]
    });
    const html = htmlResult.value;

    // Create PDF with better formatting using PDFKit
    const chunks = [];
    const doc = new PDFDocument2({
      size: 'A4',
      margins: {
        top: 72,
        bottom: 72,
        left: 72,
        right: 72
      },
      bufferPages: true
    });

    doc.on('data', chunk => chunks.push(chunk));
    
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.json({ 
          success: true, 
          result: pdfBuffer.toString('base64'),
          filename: 'converted.pdf'
        });
        resolve();
      });

      doc.on('error', reject);

      // Try to register Arial font for Unicode support (Arabic, etc.)
      const arialPath = 'C:\\Windows\\Fonts\\arial.ttf';
      const arialBoldPath = 'C:\\Windows\\Fonts\\arialbd.ttf';
      const arialItalicPath = 'C:\\Windows\\Fonts\\ariali.ttf';
      
      let useCustomFont = false;
      try {
        if (fs.existsSync(arialPath)) {
          doc.registerFont('Arial', arialPath);
          useCustomFont = true;
        }
        if (fs.existsSync(arialBoldPath)) {
          doc.registerFont('Arial-Bold', arialBoldPath);
        }
        if (fs.existsSync(arialItalicPath)) {
          doc.registerFont('Arial-Italic', arialItalicPath);
        }
      } catch (fontError) {
        console.log('Could not register custom fonts, using default fonts');
      }

      // Helper function to detect if text contains Arabic
      const containsArabic = (text) => {
        return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
      };

      // Parse HTML and apply formatting
      const lines = html.split(/(<h[1-3]>.*?<\/h[1-3]>|<p>.*?<\/p>|<strong>.*?<\/strong>|<em>.*?<\/em>|<li>.*?<\/li>)/gs);
      
      lines.forEach(line => {
        if (!line.trim()) return;
        
        // Remove HTML tags but preserve structure
        const text = line.replace(/<[^>]*>/g, '').trim();
        if (!text) return;
        
        // Check if text has Arabic characters and set alignment
        const hasArabic = containsArabic(text);
        const textAlign = hasArabic ? 'right' : 'left';
        
        // Select appropriate font
        const regularFont = useCustomFont ? 'Arial' : 'Helvetica';
        const boldFont = useCustomFont ? 'Arial-Bold' : 'Helvetica-Bold';
        const italicFont = useCustomFont ? 'Arial-Italic' : 'Helvetica-Oblique';
        
        // Apply formatting based on HTML tags
        if (line.includes('<h1>')) {
          doc.fontSize(24).font(boldFont).fillColor('#000000');
          doc.text(text, { align: textAlign, features: ['rtla', 'calt'] });
          doc.moveDown(0.5);
        } else if (line.includes('<h2>')) {
          doc.fontSize(18).font(boldFont).fillColor('#000000');
          doc.text(text, { align: textAlign, features: ['rtla', 'calt'] });
          doc.moveDown(0.4);
        } else if (line.includes('<h3>')) {
          doc.fontSize(14).font(boldFont).fillColor('#000000');
          doc.text(text, { align: textAlign, features: ['rtla', 'calt'] });
          doc.moveDown(0.3);
        } else if (line.includes('<strong>')) {
          doc.fontSize(12).font(boldFont).fillColor('#000000');
          doc.text(text, { align: textAlign, continued: false, features: ['rtla', 'calt'] });
        } else if (line.includes('<em>')) {
          doc.fontSize(12).font(italicFont).fillColor('#000000');
          doc.text(text, { align: textAlign, continued: false, features: ['rtla', 'calt'] });
        } else if (line.includes('<li>')) {
          doc.fontSize(12).font(regularFont).fillColor('#000000');
          const bullet = hasArabic ? text + ' •' : '• ' + text;
          doc.text(bullet, { indent: hasArabic ? 0 : 20, align: textAlign, features: ['rtla', 'calt'] });
        } else if (line.includes('<p>')) {
          doc.fontSize(12).font(regularFont).fillColor('#000000');
          doc.text(text, { align: textAlign, lineGap: 5, features: ['rtla', 'calt'] });
          doc.moveDown(0.3);
        } else {
          doc.fontSize(12).font(regularFont).fillColor('#000000');
          doc.text(text, { align: textAlign, lineGap: 5, features: ['rtla', 'calt'] });
        }
      });

      doc.end();
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Word to PDF conversion failed',
      message: error.message
    });
  }
};

// PDF to Excel
exports.pdfToExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }

    // Extract text from PDF
    const pdfData = await parsePdfSilently(req.file.buffer);
    const extractedText = pdfData.text;

    // Split text into lines and create simple table
    const lines = extractedText.split('\n').filter(line => line.trim());
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(lines.map(line => [line]));
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.json({ 
      success: true, 
      result: excelBuffer.toString('base64'),
      filename: 'converted.xlsx',
      note: 'Basic conversion - table detection is limited. For complex tables, consider specialized services.'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'PDF to Excel conversion failed',
      message: error.message
    });
  }
};

// Excel to PDF
exports.excelToPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No Excel file provided' 
      });
    }

    // Read Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to CSV/text
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    const lines = csvData.split('\n');

    // Create PDF
    const chunks = [];
    const doc = new PDFDocument2({ margin: 50 });

    doc.on('data', chunk => chunks.push(chunk));
    
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.json({ 
          success: true, 
          result: pdfBuffer.toString('base64'),
          filename: 'converted.pdf'
        });
        resolve();
      });

      doc.on('error', reject);

      // Add title
      doc.fontSize(16).text('Excel Data', { align: 'center' });
      doc.moveDown();

      // Add content
      doc.fontSize(10);
      lines.forEach((line, index) => {
        if (index > 0 && index % 50 === 0) {
          doc.addPage();
        }
        doc.text(line, { lineGap: 2 });
      });

      doc.end();
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Excel to PDF conversion failed',
      message: error.message
    });
  }
};

// ==================== IMAGE TOOLS ====================

// Image Compress
exports.imageCompress = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    const { quality = 80 } = req.body;
    
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();
    
    let compressed;
    if (metadata.format === 'png') {
      compressed = await image.png({ quality: parseInt(quality) }).toBuffer();
    } else if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      compressed = await image.jpeg({ quality: parseInt(quality) }).toBuffer();
    } else if (metadata.format === 'webp') {
      compressed = await image.webp({ quality: parseInt(quality) }).toBuffer();
    } else {
      compress = await image.jpeg({ quality: parseInt(quality) }).toBuffer();
    }

    const originalSize = req.file.buffer.length;
    const compressedSize = compressed.length;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    
    res.json({ 
      success: true, 
      result: compressed.toString('base64'),
      filename: `compressed.${metadata.format}`,
      originalSize: originalSize,
      compressedSize: compressedSize,
      savings: `${savings}%`,
      format: metadata.format
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Image compression failed',
      message: error.message
    });
  }
};

// Image Resize
exports.imageResize = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    const { width, height } = req.body;
    
    if (!width && !height) {
      return res.status(400).json({ 
        success: false, 
        error: 'Width or height must be provided' 
      });
    }

    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();
    
    const resized = await image.resize({
      width: width ? parseInt(width) : null,
      height: height ? parseInt(height) : null,
      fit: 'inside'
    }).toBuffer();
    
    res.json({ 
      success: true, 
      result: resized.toString('base64'),
      filename: `resized.${metadata.format}`,
      originalDimensions: { width: metadata.width, height: metadata.height },
      newDimensions: { width: width || 'auto', height: height || 'auto' },
      format: metadata.format
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Image resize failed',
      message: error.message
    });
  }
};

// Image Convert
exports.imageConvert = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    const { format = 'png' } = req.body;
    
    const image = sharp(req.file.buffer);
    let converted;

    switch (format.toLowerCase()) {
      case 'png':
        converted = await image.png().toBuffer();
        break;
      case 'jpeg':
      case 'jpg':
        converted = await image.jpeg().toBuffer();
        break;
      case 'webp':
        converted = await image.webp().toBuffer();
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid format. Use: png, jpeg, or webp' 
        });
    }
    
    res.json({ 
      success: true, 
      result: converted.toString('base64'),
      filename: `converted.${format}`,
      format: format
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Image conversion failed',
      message: error.message
    });
  }
};

// Remove Background (placeholder)
exports.imageRemoveBg = async (req, res) => {
  try {
    res.json({ 
      success: false, 
      error: 'Background removal requires external AI service',
      message: 'Integrate with Remove.bg API or similar service for this feature'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Background removal failed',
      message: error.message
    });
  }
};

// ==================== TEXT TOOLS ====================

// Text Case Converter
exports.textCase = (req, res) => {
  try {
    const { data, caseType } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    let result;
    
    switch(caseType) {
      case 'upper':
        result = data.toUpperCase();
        break;
      case 'lower':
        result = data.toLowerCase();
        break;
      case 'title':
        result = data.replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        break;
      case 'sentence':
        result = data.charAt(0).toUpperCase() + data.slice(1).toLowerCase();
        break;
      case 'camel':
        result = data.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
        break;
      case 'snake':
        result = data.toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebab':
        result = data.toLowerCase().replace(/\s+/g, '-');
        break;
      case 'toggle':
        result = data.split('').map(char => {
          return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
        }).join('');
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid case type' 
        });
    }
    
    res.json({ 
      success: true, 
      result: result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Case conversion failed',
      message: error.message
    });
  }
};

// Text Counter
exports.textCount = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const characters = data.length;
    const charactersNoSpaces = data.replace(/\s/g, '').length;
    const words = data.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lines = data.split(/\r\n|\r|\n/).length;
    const sentences = data.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = data.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words / 200);
    
    res.json({ 
      success: true, 
      result: {
        characters,
        charactersNoSpaces,
        words,
        lines,
        sentences,
        paragraphs,
        readingTime: `${readingTime} min`
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Text count failed',
      message: error.message
    });
  }
};

// Text Reverse
exports.textReverse = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const reversed = data.split('').reverse().join('');
    
    res.json({ 
      success: true, 
      result: reversed 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Text reverse failed',
      message: error.message
    });
  }
};

// Slug Generator
exports.textSlug = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const slug = slugify(data, {
      lower: true,
      strict: true,
      trim: true
    });
    
    res.json({ 
      success: true, 
      result: slug 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Slug generation failed',
      message: error.message
    });
  }
};

// Text Diff Checker
exports.textDiff = (req, res) => {
  try {
    const { text1, text2 } = req.body;
    
    if (!text1 || !text2) {
      return res.status(400).json({ 
        success: false, 
        error: 'Both texts must be provided' 
      });
    }

    const diff = Diff.diffWords(text1, text2);
    
    res.json({ 
      success: true, 
      result: diff
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Text diff failed',
      message: error.message
    });
  }
};

// ==================== WEB TOOLS ====================

// QR Code Generator
exports.qrGenerate = async (req, res) => {
  try {
    const { data, size = 300 } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    const qrCode = await QRCode.toDataURL(data, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    res.json({ 
      success: true, 
      result: qrCode
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'QR code generation failed',
      message: error.message
    });
  }
};

// HTML Minifier
exports.htmlMinify = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No HTML provided' 
      });
    }

    const minified = htmlMinifier(data, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    });
    
    const originalSize = Buffer.byteLength(data, 'utf8');
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
    
    res.json({ 
      success: true, 
      result: {
        minified: minified,
        originalSize: originalSize,
        minifiedSize: minifiedSize,
        savings: `${savings}%`
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'HTML minification failed',
      message: error.message
    });
  }
};

// CSS Minifier
exports.cssMinify = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No CSS provided' 
      });
    }

    const output = new CleanCSS().minify(data);
    
    if (output.errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'CSS minification errors',
        errors: output.errors
      });
    }

    const originalSize = Buffer.byteLength(data, 'utf8');
    const minifiedSize = Buffer.byteLength(output.styles, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
    
    res.json({ 
      success: true, 
      result: {
        minified: output.styles,
        originalSize: originalSize,
        minifiedSize: minifiedSize,
        savings: `${savings}%`
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'CSS minification failed',
      message: error.message
    });
  }
};

// JavaScript Minifier
exports.jsMinify = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No JavaScript provided' 
      });
    }

    const result = UglifyJS.minify(data);
    
    if (result.error) {
      return res.status(400).json({ 
        success: false, 
        error: 'JavaScript minification error',
        message: result.error.message
      });
    }

    const originalSize = Buffer.byteLength(data, 'utf8');
    const minifiedSize = Buffer.byteLength(result.code, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
    
    res.json({ 
      success: true, 
      result: {
        minified: result.code,
        originalSize: originalSize,
        minifiedSize: minifiedSize,
        savings: `${savings}%`
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'JavaScript minification failed',
      message: error.message
    });
  }
};

// Markdown to HTML Converter
exports.markdownConvert = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No Markdown provided' 
      });
    }

    const html = marked(data);
    
    res.json({ 
      success: true, 
      result: html
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Markdown conversion failed',
      message: error.message
    });
  }
};
