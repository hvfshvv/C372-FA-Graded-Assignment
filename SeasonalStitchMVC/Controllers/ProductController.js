const Hoodie = require('../models/Hoodie');

const ProductController = {
    list: (req, res) => {
        Hoodie.getAll((err, hoodies) => {
            if (err) return res.status(500).send('Error loading products');
            res.render('index', { hoodies, user: req.session.user });
        });
    },

    getById: (req, res) => {
        const id = req.params.id;
        Hoodie.getById(id, (err, hoodie) => {
            if (err || !hoodie) return res.status(404).send('Hoodie not found');
            res.render('update', { hoodie, user: req.session.user });
        });
    },

    add: (req, res) => {
        const data = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image_url: req.file ? '/images/' + req.file.filename : null,
            stock: req.body.stock,
            season: req.body.season
        };

        Hoodie.add(data, (err) => {
            if (err) return res.status(500).send('Failed to add hoodie');
            res.redirect('/');
        });
    },

    update: (req, res) => {
        const id = req.params.id;
        const data = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image_url: req.file ? '/images/' + req.file.filename : req.body.currentImage,
            stock: req.body.stock,
            season: req.body.season
        };

        Hoodie.update(id, data, (err) => {
            if (err) return res.status(500).send('Update failed');
            res.redirect('/');
        });
    },

    delete: (req, res) => {
        const id = req.params.id;
        Hoodie.delete(id, (err) => {
            if (err) return res.status(500).send('Delete failed');
            res.redirect('/');
        });
    }
};

module.exports = ProductController;
