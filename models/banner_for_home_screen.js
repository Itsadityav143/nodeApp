let mongoose = require("mongoose")

const BannerSchema = new mongoose.Schema({
    bannerImage: String,
    is_active: {
        type: Boolean,
        default: false
    }

})

exports.BannerModelHome = mongoose.model("BannerforHomeScreen", BannerSchema);