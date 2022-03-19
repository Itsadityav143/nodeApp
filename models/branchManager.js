var mongoose = require("mongoose")

const branchManagerSchema = new mongoose.Schema({
    superMarket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarket"
    },
    branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch"
    },
    branch_name: String,
    manager_name: String,
    email_id: String,
    contact_number: String,
    location: String,
    is_active: {
        type: Boolean,
        default: 0
    },
    access_token: String,
    verification_code: String,
    is_verified: {
        type: Boolean,
        default: false
    },
    device_type: {
        type: Number,
        default: 0 //1 android 2. ios 3. web
    },
    device_token: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
})

exports.branchManagerModel = mongoose.model('branchManager', branchManagerSchema);