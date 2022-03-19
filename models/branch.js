var mongoose = require("mongoose")

const branchSchema = new mongoose.Schema({
    superMarket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarket"
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarketCategories"
    }],
    subCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarketSubCategories"
    }],
    opening_time: Number,
    closing_time: Number,
    image: String,
    branchId: String,
    name: String,
    address: String,
    is_active: {
        type: Boolean,
        default: 0
    },
    lat: {
        type: String,
        default: '27.8974'
    },
    long: {
        type: String,
        default: '78.0880'
    },

}, {
    timestamps: true
})

exports.branchModel = mongoose.model('branch', branchSchema);