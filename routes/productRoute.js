const express = require('express');
const router = express.Router();
//require the model 
const Product = require("../models/product.model");


//GET all product 
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);

    } catch (err) {
        res.json({ message: err });
    }
});

// POST product
router.post('/', async (req, res) => {
    const product = new Product({
        Title: req.body.Title,
        disc: req.body.disc,
        price: req.body.price,
        quantity: req.body.quantity
    });
    try {
        const savedProducts = await product.save();
        res.json(savedProducts);

    } catch (err) {
        res.json({ message: err });
    }
});

//GET-BYID specific product 
router.get('/:productId', async (req, res) => {
    try {
        console.log(req.params.productId);
        const product = await Product.findById(req.params.productId);
        res.json(product);
        console.log(product);

    } catch (err) {
        res.json({ message: err });
    }
});

//DELETE specific product 
router.delete('/:productId', async (req, res) => {
    try {
        const removeProduct = await Product.remove({ _id: req.params.productId });
        res.json({
            message: "product removed",
            Data: removeProduct
        });

    } catch (err) {
        res.json({ message: err });
    }

});

//Update specific product
router.patch('/updatePrice/:productId', async (req, res) => {
    try {
        await Product.findByIdAndUpdate(
            { _id: req.params.productId },
            { $set: { price: req.body.price } },
            { runValidators: true }
        );
        res.json({
            message: "product updated",

        });

    } catch (err) {
        res.json({ message: err });
    }

});

module.exports = router;