const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Hello from Tic Tac Toe Backend!');
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
