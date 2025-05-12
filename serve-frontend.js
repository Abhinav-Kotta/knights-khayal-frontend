// basic-static-server.js
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5173;
const distPath = path.join(__dirname, 'dist');
const uploadsPath = path.join(__dirname, 'uploads');

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.txt': 'text/plain',
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Parse the URL path
  let urlPath = req.url;
  
  // Handle URL params by removing everything after the ? character
  if (urlPath.includes('?')) {
    urlPath = urlPath.split('?')[0];
  }
  
  console.log(`Request: ${urlPath}`);
  
  // Normalize path to prevent directory traversal attacks
  const safePath = path.normalize(urlPath);
  
  // Check if this is a request for an upload file
  if (safePath.startsWith('/uploads/')) {
    const filePath = path.join(uploadsPath, safePath.replace('/uploads/', ''));
    serveFile(filePath, res);
    return;
  }
  
  // Try to serve a static file from dist directory
  const filePath = path.join(distPath, safePath);
  
  // Check if the file exists
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      // File exists, serve it
      serveFile(filePath, res);
    } else if (safePath === '/') {
      // Root path, serve index.html
      serveFile(path.join(distPath, 'index.html'), res);
    } else {
      // For any other path, serve index.html for client-side routing
      serveFile(path.join(distPath, 'index.html'), res);
    }
  });
});

// Helper function to serve files
function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // File not found
      console.error(`File not found: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    
    // Get the file extension
    const ext = path.extname(filePath);
    
    // Get the MIME type or default to 'application/octet-stream'
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Send the file
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} - http://localhost:${PORT}`);
});