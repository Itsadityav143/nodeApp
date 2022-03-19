const mongoose = require("mongoose")

let orderSchema = new mongoose.Schema({
    item_orderd: [Object],
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
        default: "PENDING" // ACCPECTBYRESTAURANT // REJECTEDBYRESTAURANT // DRIVERASSIGNED //ONTHEWAY //DELIVERED // CANCELLEDBYUSER //READY //ORDERDEXPIRED
    },
    preparation_time: {
        type: Number,
        default: 0
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
    accepted_at : Date,
}, {
    timestamps: true
});


exports.OrderModel = mongoose.model("orders", orderSchema);