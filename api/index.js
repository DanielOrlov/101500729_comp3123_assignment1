// api/index.js
import app from '../app.js';

// Vercel's Node runtime treats an exported function/app as the handler
export default function handler(req, res) {
  return app(req, res);
}
