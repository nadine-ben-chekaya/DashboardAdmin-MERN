const mongoose = require("mongoose");


//schema
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    Title: {
        type: String,
        required: true
    },
    disc: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

});


module.exports = mongoose.model("Products", ProductSchema);