var mongoose = require('mongoose')

const restaurantItemRatingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        default: null
    },
    rate: Number,
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        default: null
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dish',
        default: null
    },
    review: String
}, {
    timestamps: true
});


exports.restaurantItemRatingModel = mongoose.model('restaurantItemRating', restaurantItemRatingSchema);