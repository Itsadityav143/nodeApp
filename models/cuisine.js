const {
    string
} = require('joi');
var mongoose = require('mongoose')


let cuisineSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    }
})


exports.cuisineModel = mongoose.model("cuisines", cuisineSchema);