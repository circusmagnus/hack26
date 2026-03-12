const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// All other GET requests will be served by React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
