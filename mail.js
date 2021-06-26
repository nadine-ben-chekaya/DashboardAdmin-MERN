const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: "66eb1b268b74e391b97255e5cb3e2733-fa6e84b7-427d5c18", // TODO: Replace with your mailgun API KEY
        domain: "sandbox46b66803bf434844a0c007fc4f4c25ad.mailgun.org" // TODO: Replace with your mailgun DOMAIN
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));


const sendMail = (email, subject, text, cb) => {
    const mailOptions = {
        from: "Mailgun Sandbox <postmaster@sandbox46b66803bf434844a0c007fc4f4c25ad.mailgun.org>", // TODO replace this with your own email
        to: email, // TODO: the receiver email has to be authorized for the free tier
        subject,
        text
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, data);
    });
}

module.exports = sendMail;