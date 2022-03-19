let mongoose = require("mongoose")

const inventorySchema = new mongoose.Schema({
    branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch"
    },
    superMarket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarket"
    },
    barcode_number: String,
    product_details: Object,
    sold_count: {
        type: Number,
        default: 0
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarketProducts"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarketCategories"
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "superMarketSubCategories"
    },
    price: String,
    selling_price: Number,
    discount_price: Number,
    quantity: Number,
    unit: String,
    is_active: {
        type: Boolean,
        default: 0
    },
    unit_measurement: Number

})

exports.inventoryModel = mongoose.model("inventory", inventorySchema);