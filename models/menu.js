var mongoose = require('mongoose')


let menuSchema = new mongoose.Schema({
    menu_title: {
        type: String,
        default: ""
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        default: null
    }
})


exports.MenuModel = mongoose.model("menus", menuSchema);