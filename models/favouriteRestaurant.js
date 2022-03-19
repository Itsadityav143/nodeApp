var mongoose = require('mongoose')


let favouriteSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    }

}, {
    timestamps: true
})
exports.FavouriteModel = mongoose.model("favourite", favouriteSchema);