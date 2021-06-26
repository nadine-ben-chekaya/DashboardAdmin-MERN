const express = require("express");
//cree des gestionnaire de route
const router = express.Router();
//require the model 
const User1 = require("../models/userModel");
//const sendMail = require('./mail');
const { log } = console;
const UserAuth = require('../models/auth.model.js');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../helpers/dbErrorHandling');
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const {
    validSign,
    validLogin,
    forgotPasswordValidator,
    resetPasswordValidator
} = require('../helpers/valid')

/*const mailOptions = {
    from: "nadinbenchekaya@gmail.com", // TODO replace this with your own email
    to: email,
    subject: "subject",
    text: "hello "
};*/

//elli ken f ./mail
const auth = {
    auth: {
        api_key: "",  // TODO: Replace with your mailgun API KEY
        domain: "" // TODO: Replace with your mailgun DOMAIN
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));


const sendMail = (email, token, cb) => {
    const mailOptions = {
        from: "nadine.ben.chekaya.12345@gmail.com", // TODO replace this with your own email
        to: email,
        subject: 'Account activation link',
        html: `
            <h1>Please use the following to activate your account</h1>
            <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
            <hr />
            <p>This email may containe sensetive information</p>
            <p>${process.env.CLIENT_URL}</p>
        `
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, data);
    });
}

//******* */


/* Method eli t5alini na5ou data m BD nafficheha f front */
router.get('/users', (req, res) => {

    User1.find({})
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

    const newUser = new User1(data);

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

//elli ken f controller njibou lena 

//Register
router.post('/register', validSign, (req, res) => {

    const { name, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: "error 9bal ma nemchi nlawej ken email mawjoud"
        });
    } else {

        /*UserAuth.findOne({
            email
        }).exec((err, user) => {
            return res.status(422).json({
                errors: "error ba3d ma nemchi nlawej ken email mawjoud"
            });
            if (user) {
                return res.status(400).json({
                    errors: 'Email is taken'
                });
            }
        });*/

        const token = jwt.sign(
            {
                name,
                email,
                password
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: '5m'
            }
        );

        // send mail mailgun et nodemailer 
        sendMail(email, token, function (err, data) {
            if (err) {
                log('ERROR: ', err);
                return res.status(500).json({ message: err.message || 'Internal Error' });
            }
            log('Email sent!!!');
            return res.json({ message: 'Email sent!!!!!' });
        });


    }
});

//login
router.post('/login', validLogin, (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        // check if user exist
        UserAuth.findOne({
            email
        }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    errors: 'User with that email does not exist. Please signup'
                });
            }
            // authenticate
            if (!user.authenticate(password)) {
                return res.status(400).json({
                    errors: 'Email and password do not match'
                });
            }
            // generate a token and send to client
            const token = jwt.sign(
                {
                    _id: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '7d'
                }
            );
            const { _id, name, email, role } = user;

            return res.json({
                token,
                user: {
                    _id,
                    name,
                    email,
                    role
                }
            });
        });
    }
})

//activation
router.post('/activation', (req, res) => {
    const { token } = req.body;

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
            if (err) {
                console.log('Activation error');
                return res.status(401).json({
                    errors: 'Expired link. Signup again'
                });
            } else {
                const { name, email, password } = jwt.decode(token);

                console.log(email);
                const user = new UserAuth({
                    name,
                    email,
                    password
                });

                user.save((err, user) => {
                    if (err) {
                        console.log('Save error', errorHandler(err));
                        return res.status(401).json({
                            errors: errorHandler(err)
                        });
                    } else {
                        return res.json({
                            success: true,
                            message: user,
                            message: 'Signup success'
                        });
                    }
                });
            }
        });
    } else {
        return res.json({
            message: 'error happening please try again'
        });
    }
});

// forgot reset password
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET, algorithms: ['RS256'] // req.user._id
});

exports.adminMiddleware = (req, res, next) => {
    User.findById({
        _id: req.user._id
    }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied.'
            });
        }

        req.profile = user;
        next();
    });
};

router.put('/forgotpassword', forgotPasswordValidator, (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        User.findOne(
            {
                email
            },
            (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'User with that email does not exist'
                    });
                }

                const token = jwt.sign(
                    {
                        _id: user._id
                    },
                    process.env.JWT_RESET_PASSWORD,
                    {
                        expiresIn: '10m'
                    }
                );

                const emailData = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: `Password Reset link`,
                    html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `
                };

                return user.updateOne(
                    {
                        resetPasswordLink: token
                    },
                    (err, success) => {
                        if (err) {
                            console.log('RESET PASSWORD LINK ERROR', err);
                            return res.status(400).json({
                                error:
                                    'Database connection error on user password forgot request'
                            });
                        } else {
                            sgMail
                                .send(emailData)
                                .then(sent => {
                                    // console.log('SIGNUP EMAIL SENT', sent)
                                    return res.json({
                                        message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                                    });
                                })
                                .catch(err => {
                                    // console.log('SIGNUP EMAIL SENT ERROR', err)
                                    return res.json({
                                        message: err.message
                                    });
                                });
                        }
                    }
                );
            }
        );
    }
});

router.put('/resetpassword', resetPasswordValidator, (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        if (resetPasswordLink) {
            jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
                err,
                decoded
            ) {
                if (err) {
                    return res.status(400).json({
                        error: 'Expired link. Try again'
                    });
                }

                User.findOne(
                    {
                        resetPasswordLink
                    },
                    (err, user) => {
                        if (err || !user) {
                            return res.status(400).json({
                                error: 'Something went wrong. Try later'
                            });
                        }

                        const updatedFields = {
                            password: newPassword,
                            resetPasswordLink: ''
                        };

                        user = _.extend(user, updatedFields);

                        user.save((err, result) => {
                            if (err) {
                                return res.status(400).json({
                                    error: 'Error resetting user password'
                                });
                            }
                            res.json({
                                message: `Great! Now you can login with your new password`
                            });
                        });
                    }
                );
            });
        }
    }
});

module.exports = router;