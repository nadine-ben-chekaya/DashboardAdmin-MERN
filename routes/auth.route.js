const express = require('express')
const router = express.Router()

// Load Controllers
const {
    registerController,
    activationController,
    signinController,
    forgotPasswordController,
    resetPasswordController,
} = require('../controllers/auth.controller.js')
//const { registerController } = require('../controllers/auth.controller')


const {
    validSign,
    validLogin,
    forgotPasswordValidator,
    resetPasswordValidator
} = require('../helpers/valid')
/*app.post('/user/all', function (req, res) {
    Controller.Create
});*/
/*, function (req, res) {
    validSign
}*/

router.post('/register', function (req, res) {
    registerController
}
)

router.post('/login',
    function (req, res) {
        validLogin
    }, function (req, res) {
        signinController
    })

router.post('/activation', function (req, res) {
    activationController
})

// forgot reset password
router.put('/forgotpassword', function (req, res) {
    forgotPasswordValidator
}, function (req, res) {
    forgotPasswordController
});
router.put('/resetpassword', function (req, res) {
    resetPasswordValidator
}, function (req, res) {
    resetPasswordController
});

// Google and Facebook Login
/*router.post('/googlelogin', googleController)
router.post('/facebooklogin', facebookController)*/
module.exports = router