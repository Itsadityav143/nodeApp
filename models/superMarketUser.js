let mongoose = require("mongoose")

const superMarketSchema = new mongoose.Schema({
    username: String,
    country_code: String,
    email: String,
    mobile_number: String,
    password: String,
    verification_code: String,
    profile_image: String,
    is_verified: {
        type: Boolean,
        default: 0
    },
    is_blocked: {
        type: Boolean,
        default: 0
    },
    is_approved_by_admin: {
        type: String,
        default: "0" //0==pending , 1==approved , 2 ==disapproved
    },
    bank_details: {
        account_holder_name: String,
        bank_name: String,
        account_number: String,
        branch_code: String,
        branch_name: String

    },
    device_type: {
        type: Number,
        default: 0 //1 android 2. ios 3. web
    },
    device_token: {
        type: String,
        default: ""
    },
    // location: {
    //     type: {
    //         type: String,
    //         default: 'Point'
    //     },
    //     coordinates: [Number],
    //     default: [0, 0]
    // },
    lat: {
        type: String,
        default: '27.8974'
    },
    long: {
        type: String,
        default: '78.0880'
    },
    is_profile_completed: {
        type: String,
        default: "0"
    },
    access_token: String
}, {
    timestamps: true
})

// superMarketSchema.index({
//     location: "2dsphere"
// });


exports.superMarketModel = mongoose.model("superMarket", superMarketSchema);