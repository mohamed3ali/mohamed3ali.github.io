// Example API route for Next.js API Routes
// For Express integration, move this logic to your Express server

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    // Example: JSON Formatter
    if (type === 'json-format') {
      try {
        const parsed = JSON.parse(data);
        const formatted = JSON.stringify(parsed, null, 2);
        return res.status(200).json({ 
          success: true, 
          result: formatted 
        });
      } catch (error) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid JSON format' 
        });
      }
    }

    // Example: Base64 Encode
    if (type === 'base64-encode') {
      const encoded = Buffer.from(data).toString('base64');
      return res.status(200).json({ 
        success: true, 
        result: encoded 
      });
    }

    // Example: Base64 Decode
    if (type === 'base64-decode') {
      try {
        const decoded = Buffer.from(data, 'base64').toString('utf-8');
        return res.status(200).json({ 
          success: true, 
          result: decoded 
        });
      } catch (error) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid Base64 string' 
        });
      }
    }

    return res.status(400).json({ 
      success: false, 
      error: 'Unknown tool type' 
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
