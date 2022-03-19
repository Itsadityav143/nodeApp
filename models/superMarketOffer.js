const mongoose = require('mongoose')

let superMarketOfferSchema = new mongoose.Schema({
    superMarket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarket"
    },
    offer_code: String,
    discount_type: String, //1 Flat 2 // percent
    discount_amount: String,
    offer_validity: {
        from: Date,
        to: Date
    },
    description: String,
    created_by: String,
    is_active: {
        type: Boolean,
        default: 0
    },
    limit: Number

})

exports.superMarketOfferModel = mongoose.model("superMarketOffer", superMarketOfferSchema);