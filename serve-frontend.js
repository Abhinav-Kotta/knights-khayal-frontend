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

app.get('/uploads/:imageName(*)', (req, res) => {
  const imagePath = path.join(__dirname, 'uploads', req.params.imageName);
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('Image not found');
    }
  });
});

app.get('/:path(*)', (req, res) => {
  const filePath = path.join(distPath, req.params.path);
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    
    res.sendFile(filePath);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});