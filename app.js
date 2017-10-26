require('dotenv').config();
const express = require('express');

// INITIALIZE EXPRESS
const app = express();

// VIEW ENGINE SETUP
app.set('view engine', 'ejs');

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
