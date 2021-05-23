const express = require("express");
//cree des gestionnaire de route
const router = express.Router();
//require the model 
const User = require("../models/userModel");

// The route to get and send data from DB to frontend

/* Method eli t5alini na5ou data m BD nafficheha f front */
router.get('/users', (req, res) => {
    User.find({})
        .then((data) => {
            console.log('Data:', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('Data:', error);
        });



});//send foundUsers from back-end(userModel) and we receive them in the front-end(Users.js)

//POST method
router.post('/save', (req, res) => {
    //req.body hiya data li jeya m client f request
    console.log('Body', req.body);
    const data = req.body;

    const newUser = new User(data);

    //.save
    newUser.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        return res.json({
            msg: 'Your data has been saved!!!'
        });

    });

    res.json({
        msg: 'we received your data!!!'
    });

});

module.exports = router;