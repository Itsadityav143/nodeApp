var mongoose = require('mongoose')


let superMarketCartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    total_items_in_cart: {
        type: Number,
        default: 0
    },
    grand_total_of_cart: {
        type: Number,
        default: 0
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch"
    },
    items_in_cart: [{
        inventory_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "inventory"
        },
        selected_quantity: {
            type: Number,
            default: 0
        },
        item_unit_price: {
            type: Number,
            default: 0
        },
        item_total_price: {
            type: Number,
            default: 0
        }
    }]
})


exports.superMarketCartModel = mongoose.model("superMarketCart", superMarketCartSchema);