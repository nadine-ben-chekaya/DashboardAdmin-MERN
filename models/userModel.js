const mongoose = require("mongoose");


//schema
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    age: Number,
    city: String,
    gender: String

});



const User1 = mongoose.model("User1", userSchema);

module.exports = User1;