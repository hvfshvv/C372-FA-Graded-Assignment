// controllers/ProductController.js
const Product = require('../models/Product');

const ProductController = {
    list: (req, res) => {
        Product.getAll((err, results) => {
            if (err) throw err;
            res.render('index', { products: results });
        });
    },

    getById: (req, res) => {
        const id = req.params.id;
        Product.getById(id, (err, results) => {
            if (err) throw err;
            res.render('update', { product: results[0] });
        });
    },

    add: (req, res) => {
        const data = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            image: req.file ? req.file.filename : null
        };
        Product.add(data, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    },

    update: (req, res) => {
        const id = req.params.id;
        const data = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            image: req.file ? req.file.filename : req.body.currentImage
        };
        Product.update(id, data, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    },

    delete: (req, res) => {
        const id = req.params.id;
        Product.delete(id, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    }
};

module.exports = ProductController;
