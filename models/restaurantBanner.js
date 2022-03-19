let mongoose = require("mongoose")

const restaurantBannerSchema = new mongoose.Schema({
    bannerImage: String,
    is_active: {
        type: Boolean,
        default: false
    }

})

exports.restaurantBannerModel = mongoose.model("restaurantBanner", restaurantBannerSchema);