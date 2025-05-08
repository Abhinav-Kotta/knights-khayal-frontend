// serve-frontend.js - ES Module version
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Check if dist directory exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error(`Error: '${distPath}' directory does not exist!`);
  console.error('You need to build the frontend first.');
  process.exit(1);
}

// Check if index.html exists
const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error(`Error: '${indexPath}' file does not exist!`);
  console.error('The frontend build may be incomplete.');
  process.exit(1);
}

// Log the available files (for debugging)
console.log('Available files in dist directory:');
try {
  const files = fs.readdirSync(distPath);
  files.forEach(file => {
    console.log(`- ${file}`);
  });
} catch (err) {
  console.error('Error reading dist directory:', err);
}

app.use(express.static(distPath));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

app.get('*', (req, res) => {
  console.log(`Serving index.html for path: ${req.path}`);
  res.sendFile(indexPath);
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Server error occurred');
});

const PORT = process.env.PORT || 5173;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Server time: ${new Date().toISOString()}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});