# ToolsHub Backend API

Express.js backend API for ToolsHub tools platform.

## 🚀 Quick Start

### Installation

```bash
cd backend
npm install
```

### Development

```bash
npm run dev
```

Server runs on http://localhost:5000

### Production

```bash
npm start
```

## 📁 Project Structure

```
backend/
├── server.js              # Main server file
├── routes/
│   └── tools.js          # API routes
├── controllers/
│   └── toolsController.js # Business logic
├── .env                   # Environment variables
├── package.json
└── README.md
```

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

### Health Check
```
GET /api/health
```

### Developer Tools

#### JSON Formatter
```
POST /api/tools/json-format
Body: { "data": "your json string" }
```

#### JSON Minifier
```
POST /api/tools/json-minify
Body: { "data": "your json string" }
```

#### Base64 Encode
```
POST /api/tools/base64-encode
Body: { "data": "text to encode" }
```

#### Base64 Decode
```
POST /api/tools/base64-decode
Body: { "data": "base64 string" }
```

#### URL Encode
```
POST /api/tools/url-encode
Body: { "data": "text to encode" }
```

#### URL Decode
```
POST /api/tools/url-decode
Body: { "data": "encoded url" }
```

#### Hash Generator
```
POST /api/tools/hash-generate
Body: { 
  "data": "text to hash",
  "algorithm": "sha256" // md5, sha1, sha256, sha512
}
```

### Text Tools

#### Text Case Converter
```
POST /api/tools/text-case
Body: { 
  "data": "your text",
  "caseType": "upper" // upper, lower, title, sentence, toggle
}
```

#### Text Counter
```
POST /api/tools/text-count
Body: { "data": "your text" }
```

#### Text Reverse
```
POST /api/tools/text-reverse
Body: { "data": "your text" }
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## 📦 Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **body-parser** - Parse request bodies
- **dotenv** - Environment variables
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **multer** - File uploads (future use)

## 🛠️ Adding New Tools

1. Add route in `routes/tools.js`:
```javascript
router.post('/your-tool', toolsController.yourTool);
```

2. Add controller in `controllers/toolsController.js`:
```javascript
exports.yourTool = (req, res) => {
  try {
    const { data } = req.body;
    // Your logic here
    res.json({ success: true, result: data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

## 🔒 Security

- Helmet.js for security headers
- CORS configured for frontend URL
- Request size limits (10mb)
- Input validation in controllers

## 📝 Response Format

Success:
```json
{
  "success": true,
  "result": "processed data"
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🧪 Testing

```bash
# Using curl
curl -X POST http://localhost:5000/api/tools/json-format \
  -H "Content-Type: application/json" \
  -d '{"data": "{\"name\":\"test\"}"}'

# Using Postman or Insomnia
# Import the endpoints and test
```

## 🚢 Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📄 License

MIT
