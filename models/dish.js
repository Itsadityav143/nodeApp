var mongoose = require('mongoose')


let dishSchema = new mongoose.Schema({
    menu_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menus',
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    dish_name: String,
    ingredient: [],
    search_keywords: [],
    dish_type: String,
    dish_price: Number,
    minimum_preparation_time: String,
    description: String,
    serving_size: String,
    dish_status: {
        type: Number,
        default: 0
    },
    dish_images: [],

})


exports.dishModel = mongoose.model("dish", dishSchema);