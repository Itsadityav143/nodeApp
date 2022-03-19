let mongoose = require("mongoose")

const superMarketSubcategorySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarketCategories"
    },
    subcategory_name: String,
    superMarket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarket"
    },

})

exports.superMarketSubcategoryModel = mongoose.model("superMarketSubCategories", superMarketSubcategorySchema);