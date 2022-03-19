var mongoose = require('mongoose')


let cartSchema = new mongoose.Schema({
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
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        default: null
    },
    items_in_cart: [{
        item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "dish"
        },
        menu_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "menus"
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


exports.CartModel = mongoose.model("cart", cartSchema);