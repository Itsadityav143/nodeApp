var FCM = require('fcm-node');
var fcm = new FCM("AAAAFWNDO5g:APA91bFrTdAORF-DhtC_XIH7X8ZBgWoGeN8n7rhk_0l6M7-ljE7t4k05BdnL6kpMzhDKsCYoUreeh4Ut_nktfIh-BwfImlTFtSqJEdFRS360jPeFmaXeymxqUcuDS6YEagCvMZblJqrY");

/*
 * -----------------------
 * GENERATE RANDOM STRING
 * -----------------------
 */
exports.generateRandomString = () => {
    let text = "";
    let possible = "123456789";

    for (var i = 0; i < 4; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};


exports.randomString = () => {
    var length = 5
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return "DP" + result.toUpperCase();
}


exports.sendNotification = async (info) => {
    console.log('******* FCM ****** \n', JSON.stringify(info));
    //let orderDetail =  await OrderModel.findById(info.order_id).populate('address_id').populate('seller_id').populate('user_id').populate("product_details.product_id").lean(true)
    var message = {
        to: info.deviceToken,
        // notification: {
        //     title: info.title,
        //     body: info.message,
        //     sound: 'space',
        //     android_channel_id: 'all'
        // },
        data: {
            type: info.type, // "Admin",
            title: info.title,
            body: info.message,
            //   orderDetail: orderDetail,
            order_id: info.order_id
        }
    };
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!", err, response);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

//Ios push notification

exports.sendPushNotificationForIos = function (serverKey, token, device_type, payload, notify) {
    console.log({
        payload
    });

    var fcm = new FCM(serverKey);
    var message = {
        to: token,
        collapse_key: 'your_collapse_key',
        notification: notify,
        data: payload,
    };

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("=======================IOS===================")
            console.log(null, err);
        } else {
            console.log("=======================IOS===================")
            console.log(null, response)
        }
    });

}