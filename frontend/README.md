# ToolsHub Frontend

Modern Next.js frontend for the ToolsHub tools platform.

## 🚀 Quick Start

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Frontend runs on http://localhost:3000

**Important**: Make sure the backend is running on port 5000 before starting the frontend.

## 📁 Project Structure

```
frontend/
├── components/
│   ├── Header.jsx          # Navigation with dark mode
│   ├── Footer.jsx          # Footer with links
│   ├── Button.jsx          # Reusable button
│   ├── ToolCard.jsx        # Tool display card
│   ├── InputArea.jsx       # Input component
│   └── OutputArea.jsx      # Output display
├── pages/
│   ├── _app.jsx           # App wrapper
│   ├── _document.jsx      # HTML structure
│   ├── index.jsx          # Homepage
│   ├── category/
│   │   └── [category].jsx # Category pages
│   └── tools/
│       └── [tool].jsx     # Tool pages
├── styles/
│   └── globals.css        # Global styles
├── utils/
│   └── api.js             # API client
├── public/                # Static assets
├── .env.local             # Environment variables
├── next.config.js         # Next.js config
├── tailwind.config.js     # Tailwind config
└── package.json
```

## 🔌 API Integration

The frontend connects to the backend API using Axios. Configuration is in `utils/api.js`.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Using the API

```javascript
import { toolsAPI } from '../utils/api';

// JSON Formatter
const response = await toolsAPI.jsonFormat(jsonString);

// Base64 Encode
const response = await toolsAPI.base64Encode(text);

// Hash Generate
const response = await toolsAPI.hashGenerate(text, 'sha256');
```

## 🎨 Design Features

### Components

- **Header**: Sticky navigation with dark mode toggle and mobile menu
- **Footer**: Links, social media, newsletter subscription
- **ToolCard**: Animated cards with hover effects
- **InputArea**: Flexible input (text/textarea/file/url)
- **OutputArea**: Result display with copy/download
- **Button**: Multiple variants (primary, secondary, outline, ghost, danger)

### Pages

- **Homepage**: Hero, categories, featured tools, CTA
- **Tool Page**: Input/output interface, share buttons, related tools
- **Category Page**: Filtered tool list

### Animations

- Framer Motion for page transitions
- Tailwind transitions for hover effects
- Custom keyframe animations

## 🎯 Adding New Tools

1. Tool metadata is in the page component
2. API call uses the `toolsAPI` helper
3. Update the `handleProcess` function

Example:

```javascript
const handleProcess = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await toolsAPI.base64Encode(inputValue);
    
    if (response.data.success) {
      setResult(response.data.result);
    } else {
      setError(response.data.error);
    }
  } catch (err) {
    setError('Failed to connect to server');
  } finally {
    setLoading(false);
  }
};
```

## 🌙 Dark Mode

Dark mode is toggle-based using Tailwind's `dark:` classes. Toggle in the Header component.

## 📱 Responsive Design

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

All components are mobile-first responsive.

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#0ea5e9', // Change to your color
    // ...
  }
}
```

### Fonts

Edit `pages/_app.jsx` to change Google Fonts import.

### Branding

Replace "ToolsHub" in:
- `components/Header.jsx`
- `components/Footer.jsx`
- `pages/_app.jsx`

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add environment variable:
- `NEXT_PUBLIC_API_URL`: Your backend API URL

### Netlify

```bash
npm run build
```

Upload the `.next` folder and set environment variables.

## 🔧 Troubleshooting

### API Connection Error

Make sure:
1. Backend is running on port 5000
2. `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. CORS is enabled on backend

### Styles Not Loading

```bash
rm -rf .next
npm run dev
```

### Dark Mode Issues

Check that `dark` class toggles on `<html>` element in Header.jsx.

## 📦 Dependencies

- **next**: React framework
- **react**: UI library
- **framer-motion**: Animations
- **axios**: HTTP client
- **tailwindcss**: Styling

## 📄 License

MIT
