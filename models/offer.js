const mongoose = require('mongoose')

let offerSchema = new mongoose.Schema({
    // offer_type: {
    //     type: String,
    //     enum: ["spend more earn more", "free/heavy discount", "give discount/flash deals", "snatch it", "slash it", "group buy"]
    // },
    offer_name: String,
    offer_code: String,
    offer_type: String, //1 firstuser 2 // normal user
    discount_type: String, //1 Flat 2 // percent
    discount_amount: String,

    offer_validity: {
        from: Date,
        to: Date
    },
    offer_duration: {
        from: Date,
        to: Date
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    min_amount: String,
    max_amount: String,
    is_active: {
        type: Boolean,
        default: 0
    },
    created_by: String,
    limit: Number
})

exports.offerModel = mongoose.model("offer", offerSchema);