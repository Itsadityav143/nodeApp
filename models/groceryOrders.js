const mongoose = require("mongoose")

let groceryOrdersSchema = new mongoose.Schema({
    item_orderd: [Object],
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "branch"
    },
    superMarket_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "superMarket"
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "Restaurant"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User"
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "driver"
    },
    order_id: {
        type: String,
        default: ""
    },
    order_amount: {
        type: Number,
        default: 0
    },
    tax_amount: {
        type: Number,
        default: 0
    },
    discount_amount: {
        type: Number,
        default: 0
    },
    shipping_charge: {
        type: Number,
        default: 0
    },
    promo_code_applied: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    order_status: {
        type: String,
        default: "PENDING" // ACCPECTBYSTORE // REJECTEDBYSTORE // READYTODISPATCH //ONTHEWAY //DELIVERED // CANCELLEDBYUSER  //ORDERDEXPIRED
    },
    rejection_reason: {
        type: String,
        default: ""
    },
    payment_method: {
        type: String,
        default: ""
    },
    is_recieved_cash: {
        type: Boolean,
        default: false
    },
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "Address"
    },
    accepted_at: Date,
}, {
    timestamps: true
});


exports.GroceryOrdersModel = mongoose.model("groceryOrders", groceryOrdersSchema);