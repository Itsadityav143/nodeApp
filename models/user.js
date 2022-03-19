var mongoose = require('mongoose')
let userSchema = new mongoose.Schema({
    is_profile_completed: {
        type: Boolean,
        default: 0 //0 not completed 1 Completed
    },
    is_verified: {
        type: Boolean,
        default: 0
    },
    verification_code: {
        type: String,
        default: ""
    },
    profile_image: {
        type: String,
        default: ""
    },
    first_name: {
        type: String,
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    country_code: {
        type: String,
        default: ""
    },
    mobile_number: {
        type: String,
        default: ""
    },
    qr_code: String,
    password: {
        type: String,
        default: ""
    },
    access_token: {
        type: String,
        default: ""
    },
    device_type: {
        type: Number,
        default: 0 //1 android 2. ios 3. web
    },
    device_token: {
        type: String,
        default: ""
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    wallet_amount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

exports.UserModel = mongoose.model("User", userSchema);