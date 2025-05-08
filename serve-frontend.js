// super-simple-server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;
const distPath = path.join(__dirname, 'dist');

app.use(express.static(distPath));

app.use((req, res, next) => {
  const filePath = path.join(distPath, req.url);
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    
    next();
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});