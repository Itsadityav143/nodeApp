var mongoose = require('mongoose')

const restaurantRatingSchema = new mongoose.Schema({
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
    review: String
}, {
    timestamps: true
});


exports.restaurantRatingModel = mongoose.model('restaurantRating', restaurantRatingSchema);