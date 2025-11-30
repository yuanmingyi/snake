const express = require('express');
const path = require('path');
const app = express();

// Serve static files from 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the built index.html file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`游戏服务器运行在 http://localhost:${PORT}`);
});