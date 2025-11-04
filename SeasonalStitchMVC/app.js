const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
    secret: 'seasonalSecret',
    resave: false,
    saveUninitialized: true
}));

// Routes
const userRoutes = require('./routes/userRoutes');
const hoodieRoutes = require('./routes/hoodieRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/', userRoutes);
app.use('/hoodies', hoodieRoutes);
app.use('/orders', orderRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
