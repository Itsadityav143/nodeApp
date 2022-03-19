let mongoose = require("mongoose")

const superMarketCategorySchema = new mongoose.Schema({
    category: String,
    image: String,
})

exports.superMarketCategoryModel = mongoose.model("superMarketCategories", superMarketCategorySchema);