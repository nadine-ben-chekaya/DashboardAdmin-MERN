const mongoose = require("mongoose");


//schema
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    age: Number,
    city: String

});



const User = mongoose.model("User", userSchema);

module.exports = User;