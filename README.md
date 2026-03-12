# Modern Tools Website

A modern, clean, and highly responsive web-based tools platform built with Next.js, Express, and TailwindCSS. Features 21+ fully functional tools across 5 major categories.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework for production
- **React 18.2** - UI library
- **TailwindCSS 3.3** - Utility-first CSS framework
- **Framer Motion 10.16** - Animation library
- **Axios 1.6** - HTTP client

### Backend
- **Express 4.18** - Node.js web framework
- **Node.js** - JavaScript runtime
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing
- **Multer** - File upload handling

### Tool Libraries
- **jsonwebtoken** - JWT decoding
- **uuid** - UUID generation
- **qrcode** - QR code generation
- **sharp** - High-performance image processing
- **pdf-lib** - PDF manipulation
- **html-minifier** - HTML minification
- **clean-css** - CSS minification
- **uglify-js** - JavaScript minification
- **marked** - Markdown parsing
- **diff** - Text comparison
- **slugify** - URL slug generation

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── controllers/
│   │   └── toolsController.js    # All tool logic (21+ tools)
│   ├── routes/
│   │   └── tools.js               # API endpoints
│   ├── server.js                   # Express server
│   ├── package.json
│   └── .env
├── frontend/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   ├── ToolCard.jsx
│   │   ├── InputArea.jsx
│   │   └── OutputArea.jsx
│   ├── pages/
│   │   ├── index.jsx               # Homepage
│   │   ├── tools/
│   │   │   ├── json-formatter.js
│   │   │   ├── jwt-decoder.js
│   │   │   ├── qr-generator.js
│   │   │   ├── password-generator.js
│   │   │   └── image-compressor.js
│   │   ├── _app.jsx
│   │   └── _document.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── api.js                  # API client
│   └── package.json
└── README.md
```

## 🛠️ Available Tools

### Developer Tools (10 tools)
1. **JSON Formatter** - Format and beautify JSON data
2. **JSON Minifier** - Compress JSON by removing whitespace
3. **JWT Decoder** - Decode and inspect JSON Web Tokens
4. **Base64 Encoder** - Encode text to Base64
5. **Base64 Decoder** - Decode Base64 strings
6. **UUID Generator** - Generate unique identifiers
7. **Password Generator** - Create secure random passwords
8. **URL Encoder** - Encode URLs for safe transmission
9. **URL Decoder** - Decode URL-encoded strings
10. **Hash Generator** - Generate MD5, SHA1, SHA256, SHA512 hashes

### PDF Tools (3 tools)
1. **PDF Merger** - Combine multiple PDF files
2. **PDF Splitter** - Extract specific pages from PDFs
3. **PDF Compressor** - Reduce PDF file size

### Image Tools (4 tools)
1. **Image Compressor** - Compress images with quality control
2. **Image Resizer** - Resize images by width/height
3. **Image Converter** - Convert between PNG, JPEG, WebP
4. **Background Remover** - Remove image backgrounds (placeholder for AI integration)

### Text Tools (5 tools)
1. **Case Converter** - Convert text case (upper, lower, title, camel, snake, kebab, etc.)
2. **Word Counter** - Count words, characters, lines, sentences
3. **Text Reverser** - Reverse text strings
4. **Slug Generator** - Create URL-friendly slugs
5. **Text Diff Checker** - Compare two texts and show differences

### Web Tools (5 tools)
1. **QR Code Generator** - Create QR codes with custom sizes
2. **HTML Minifier** - Compress HTML code
3. **CSS Minifier** - Minify CSS stylesheets
4. **JS Minifier** - Minify JavaScript code
5. **Markdown Converter** - Convert Markdown to HTML

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

#### Using the Setup Script (Windows)
```powershell
.\setup.ps1
```

#### Manual Setup

1. Start the backend server:
```bash
cd backend
npm run dev
```
Backend will be available at: **http://localhost:5000**

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```
Frontend will be available at: **http://localhost:3000**

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
```

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎨 Features

- ✨ Clean and modern UI design
- 📱 Fully responsive layout
- 🌙 Dark mode support
- ⚡ Fast and optimized
- 🔒 Secure backend API with Helmet
- 🎭 Smooth animations with Framer Motion
- 📤 File upload support (50MB limit)
- 🛠️ 21+ fully functional tools
- 🔄 Real-time processing
- 💾 Download processed files
- 📊 Processing statistics (size, savings, etc.)

## 🔌 API Endpoints

### Developer Tools
- POST `/api/tools/json-format` - Format JSON
- POST `/api/tools/json-minify` - Minify JSON
- POST `/api/tools/jwt-decode` - Decode JWT
- POST `/api/tools/base64-encode` - Encode Base64
- POST `/api/tools/base64-decode` - Decode Base64
- POST `/api/tools/uuid-generate` - Generate UUID
- POST `/api/tools/password-generate` - Generate password
- POST `/api/tools/url-encode` - Encode URL
- POST `/api/tools/url-decode` - Decode URL
- POST `/api/tools/hash-generate` - Generate hash

### PDF Tools (with file upload)
- POST `/api/tools/pdf-merge` - Merge PDFs
- POST `/api/tools/pdf-split` - Split PDF
- POST `/api/tools/pdf-compress` - Compress PDF

### Image Tools (with file upload)
- POST `/api/tools/image-compress` - Compress image
- POST `/api/tools/image-resize` - Resize image
- POST `/api/tools/image-convert` - Convert image format
- POST `/api/tools/image-remove-bg` - Remove background

### Text Tools
- POST `/api/tools/text-case` - Convert text case
- POST `/api/tools/text-count` - Count words/characters
- POST `/api/tools/text-reverse` - Reverse text
- POST `/api/tools/text-slug` - Generate slug
- POST `/api/tools/text-diff` - Compare texts

### Web Tools
- POST `/api/tools/qr-generate` - Generate QR code
- POST `/api/tools/html-minify` - Minify HTML
- POST `/api/tools/css-minify` - Minify CSS
- POST `/api/tools/js-minify` - Minify JavaScript
- POST `/api/tools/markdown-convert` - Convert Markdown to HTML

## 📖 Usage Examples

### JSON Formatter
```javascript
const response = await toolsAPI.jsonFormat('{"name":"John","age":30}');
// Returns formatted JSON with proper indentation
```

### Password Generator
```javascript
const response = await toolsAPI.passwordGenerate({
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true
});
// Returns: "K9#mP2$nQ7@xR4!s"
```

### Image Compressor
```javascript
const file = /* File object from input */;
const response = await toolsAPI.imageCompress(file, 80);
// Returns compressed image with statistics
```

## 🔒 Security

- Helmet.js for setting secure HTTP headers
- CORS configured for frontend access
- File size limits (50MB)
- Input validation on all endpoints
- No sensitive data logging

## 📚 Documentation

See [GETTING_STARTED.md](GETTING_STARTED.md) for detailed setup instructions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Known Issues

- Background removal tool requires external AI service integration
- Large files (>50MB) are not supported

## 🚀 Future Enhancements

- User authentication and saved tool history
- Batch processing for multiple files
- API rate limiting
- More image filters and effects
- Video processing tools
- Document conversion tools
- Integration with cloud storage

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ using Next.js, Express, and TailwindCSS
