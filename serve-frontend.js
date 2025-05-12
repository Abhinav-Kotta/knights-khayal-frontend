import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5173;
const distPath = path.join(__dirname, 'dist');
const API_URL = process.env.API_URL || 'http://localhost:5000'; 

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

// Make sure placeholder.jpg exists
const placeholderPath = path.join(distPath, 'placeholder.jpg');
if (!fs.existsSync(placeholderPath)) {
  console.warn('Warning: placeholder.jpg not found in dist directory.');
  console.warn('Creating a simple placeholder image...');
  
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  
  try {
    const defaultPlaceholder = path.join(__dirname, 'src', 'assets', 'placeholder.jpg');
    if (fs.existsSync(defaultPlaceholder)) {
      fs.copyFileSync(defaultPlaceholder, placeholderPath);
      console.log('Copied placeholder.jpg from assets directory.');
    } else {
      fs.writeFileSync(placeholderPath, 'Placeholder Image');
      console.log('Created a simple placeholder file.');
    }
  } catch (err) {
    console.error('Failed to create placeholder image:', err);
  }
}

function proxyRequest(req, res, targetUrl) {
  console.log(`Proxying request to: ${targetUrl}`);
  
  const url = new URL(targetUrl);
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: url.host,
    }
  };
  
  const proxy = (url.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    proxyRes.pipe(res, { end: true });
  });
  
  proxy.on('error', (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error');
  });
  
  // Pipe the original request to the proxy request
  req.pipe(proxy, { end: true });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Parse the URL path
  let urlPath = req.url;
  
  // Handle URL params by removing everything after the ? character for file path checks
  let cleanPath = urlPath;
  if (cleanPath.includes('?')) {
    cleanPath = cleanPath.split('?')[0];
  }
  
  console.log(`Request: ${urlPath}`);
  
  // Normalize path to prevent directory traversal attacks
  const safePath = path.normalize(cleanPath);
  
  // Proxy API requests to the backend server
  if (safePath.startsWith('/api/')) {
    const targetUrl = `${API_URL}${urlPath}`;
    proxyRequest(req, res, targetUrl);
    return;
  }
  
  // Proxy uploads requests to the backend server
  if (safePath.startsWith('/uploads/')) {
    const targetUrl = `${API_URL}${urlPath}`;
    proxyRequest(req, res, targetUrl);
    return;
  }
  
  // Check for placeholder.jpg specifically
  if (safePath === '/placeholder.jpg') {
    if (fs.existsSync(placeholderPath)) {
      serveFile(placeholderPath, res);
    } else {
      console.error('Placeholder image not found after attempted creation');
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Placeholder image not found');
    }
    return;
  }
  
  const filePath = path.join(distPath, safePath);
  
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(filePath, res);
    } else if (safePath === '/') {
      serveFile(path.join(distPath, 'index.html'), res);
    } else {
      serveFile(path.join(distPath, 'index.html'), res);
    }
  });
});

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} - http://localhost:${PORT}`);
  console.log(`Static files serving from: ${distPath}`);
  console.log(`Proxying API requests to: ${API_URL}`);
});