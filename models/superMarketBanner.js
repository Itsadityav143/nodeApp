let mongoose = require("mongoose")

const superMarketBannerSchema = new mongoose.Schema({
    image: String,
    is_active: {
        type: Boolean,
        default: false
    }

})

exports.superMarketBannerModel = mongoose.model("superMarketBanner", superMarketBannerSchema);