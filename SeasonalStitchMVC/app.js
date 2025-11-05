const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

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

// Controllers
const ProductController = require('./controllers/ProductController');
const Hoodie = require('./models/Hoodie'); // For rendering edit form

// Routes
app.get('/', ProductController.list);
app.get('/inventory', ProductController.list);
app.get('/hoodie/:id', ProductController.getById);

// Admin routes - render the existing view filenames (add.ejs / update.ejs)
app.get('/addHoodie', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/');
    }
    res.render('add', { user: req.session.user });
});

app.post('/addHoodie', upload.single('image'), ProductController.add);

app.get('/editHoodie/:id', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/');
    }
    const id = req.params.id;
    Hoodie.getById(id, function(err, hoodie) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving hoodie');
        }
        if (!hoodie) return res.status(404).send('Hoodie not found');
        res.render('update', { hoodie, user: req.session.user });
    });
});

app.post('/editHoodie/:id', upload.single('image'), ProductController.update);
app.get('/deleteHoodie/:id', ProductController.delete);

// Temporary quick-login routes for testing (remove for production)
app.get('/loginAdmin', (req, res) => {
    req.session.user = { user_id: 1, full_name: 'Admin User', role: 'admin' };
    res.send('Logged in as admin. <a href="/">Go home</a>');
});
app.get('/loginUser', (req, res) => {
    req.session.user = { user_id: 2, full_name: 'Normal User', role: 'user' };
    res.send('Logged in as user. <a href="/">Go home</a>');
});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
