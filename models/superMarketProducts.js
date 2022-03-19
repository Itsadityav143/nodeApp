let mongoose = require("mongoose")

const superMarketProductsSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarketCategories"
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarketSubCategories"
    },
    superMarket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarket"
    },
    barcode_number: String,
    product_description: String,
    product_name: String,
    quantity: Number,
    unit: String,
    price: String,
    selling_price: Number,
    discount_price: Number,
    images: [],
    is_active: {
        type: Boolean,
        default: 0
    },
    unit_measurement: Number
})

exports.superMarketProductsModel = mongoose.model("superMarketProducts", superMarketProductsSchema);