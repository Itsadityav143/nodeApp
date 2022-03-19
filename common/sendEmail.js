




/*
Nodemailer is a module for Node.js applications to allow easy as cake email sending. The project got started back in 2010 when there was no sane option to send email messages
*/

const nodemailer = require('nodemailer');

/*
SMTP is the main transport in Nodemailer for delivering messages. SMTP is also the protocol used between different email hosts, so its truly universal. Almost every email delivery provider supports SMTP based sending
*/

var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    tls: {
        rejectUnauthorized: false
    },
    host: 'smtp.gmail.com',
    secureConnection: false,
    port: 465,
    auth: {
        user: 'huffnmove@gmail.com',
        pass: 'Checkers@123'
    }
}));



// put in tls option rejectUnauthorized: false

/*
rejectUnauthorized: If true, the server certificate is verified against the list of supplied CAs. An error event is emitted if verification fails; err.code contains the OpenSSL error code. Default: true.
*/

function sendEmail(email, subject, message) {
    return new Promise((res, rej) => {
        console.log('in sendgrid');
        var mailOptions = {
            from: 'huffnmove@gmail.com',
            to: email,
            subject: subject,
            html: message
        };
        
        transporter.sendMail(mailOptions, function (error, info) {
            console.log("error, info", error, info);
            if(error)
            return rej(error)
            else
            res()
        });
    })
}




module.exports = {
    sendEmail
}
