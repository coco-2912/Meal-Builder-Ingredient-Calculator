const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000; // Use Render's PORT or default to 10000

// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes by serving index.html (for React Router if used)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});