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

app.use('/uploads', (req, res, next) => {
  const uploadPath = path.join(__dirname, 'uploads');
  const requestedFile = req.path;
  
  if (requestedFile) {
    const filePath = path.join(uploadPath, requestedFile.replace(/^\//, ''));
    
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return next();
      }
      
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(404).send('File not found');
        }
      });
    });
  } else {
    next();
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});