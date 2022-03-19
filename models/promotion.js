var mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'offer',
    },
    banner_period: String,
    promotion_title: String,
    promotion_duration: {
        start_date: Date,
        end_date: Date
    },
    chargesForAMonth: Number,
    ChargingFeature: {
        type: String,
        enum: ["Minute", "Hour", "Day", "Month"]
    },
    is_active: {
        type: Boolean,
        default: 0
    }
}, {
    timestamps: true
})

exports.BannerModel = mongoose.model('banners', bannerSchema);