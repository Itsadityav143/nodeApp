const sgMail = require("@sendgrid/mail");

const SENGRID_API_KEY = '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'; 
sgMail.setApiKey(SENGRID_API_KEY);

function sendEmail(userEmail,subject, message) {
    return new Promise((res, rej) => {
        console.log('in sendgrid');
        const msg = {
            to: userEmail,
            from: 'info@grovtek.com',
            subject: subject,
            text: message,
            html: message,
        };
        
        
        sgMail.send(msg, function(error, info) {
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
