var QRCode = require('qrcode')
const path = require('path')
const { s3bucket } = require('./s3service')

exports.genrateQrCode = (data)=> {
    return new Promise((resolve,reject)=>{
        QRCode.toDataURL(data, function (err,base64) {
            if (err) 
                 return  console.log('ERROR MSG: ', err);
            const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
            const type = base64.split(';')[0].split('/')[1];
            const image_name = Date.now() + "-" + Math.floor(Math.random() * 1000);
            const params = {
                Bucket: 'haydiis3',
                Key: `${image_name}.${type}`, // type is not required
                Body: base64Data,
                ACL: 'public-read',
                ContentEncoding: 'base64', // required
                ContentType: `image/${type}` // required. Notice the back ticks
            }
            s3bucket.upload(params, function (err, data) {
                if (err) {
                    console.log('ERROR MSG: ', err);
                } else {
                    console.log('Successfully uploaded data',data)
                    resolve(data.Location);
                }
            });
        })
    })
 }