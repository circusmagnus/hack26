const express = require('express');
const bodyParser = require('body-parser');
const noteRoutes = require('./routes/notes');

const app = express();
app.use(bodyParser.json());

app.use('/notes', noteRoutes);

app.get('/', (req, res) => {
    res.send('Note Management System API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
