// controllers/ProductController.js
const Hoodie = require('../models/Hoodie');

const ProductController = {
    // List all hoodies - render index.ejs for both admin and users (basic)
    list: function(req, res) {
        Hoodie.getAll(function(err, hoodies) {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            const user = (req.session && req.session.user) ? req.session.user : null;

            if (Array.isArray(hoodies)) {
                hoodies.forEach(h => {
                    h.stock = Number(h.stock) || 0;
                    h.lowStock = h.stock < 30;
                });
            } else {
                hoodies = [];
            }

            // Render the existing index.ejs (expects hoodies array)
            return res.render('index', { hoodies, user });
        });
    },

    // Get hoodie by ID -> render index with single item (basic)
    getById: function(req, res) {
        const id = req.params.id;
        Hoodie.getById(id, function(err, hoodie) {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            if (!hoodie) return res.status(404).send('Hoodie not found');

            hoodie.stock = Number(hoodie.stock) || 0;
            hoodie.lowStock = hoodie.stock < 30;
            const user = req.session ? req.session.user : null;

            // reuse index.ejs by passing array with single item
            return res.render('index', { hoodies: [hoodie], user });
        });
    },

    // Add new hoodie
    add: function(req, res) {
        const hoodie = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image_url: req.file ? req.file.filename : null,
            stock: req.body.stock,
            season: req.body.season
        };

        Hoodie.add(hoodie, function(err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to add hoodie');
            }
            res.redirect('/');
        });
    },

    // Update hoodie
    update: function(req, res) {
        const id = req.params.id;
        const hoodie = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image_url: req.file ? req.file.filename : req.body.currentImage,
            stock: req.body.stock,
            season: req.body.season
        };

        Hoodie.update(id, hoodie, function(err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to update hoodie');
            }
            res.redirect('/');
        });
    },

    // Delete hoodie
    delete: function(req, res) {
        const id = req.params.id;
        Hoodie.delete(id, function(err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to delete hoodie');
            }
            res.redirect('/');
        });
    }
};

module.exports = ProductController;
