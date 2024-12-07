const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '')));

app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'index.html'));
    }catch(error) {
        console.error(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
