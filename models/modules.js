const {
    string
} = require('joi');
var mongoose = require('mongoose')


let moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    }
})


exports.moduleModel = mongoose.model("modules", moduleSchema);