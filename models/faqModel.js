var mongoose = require("mongoose");

let faqSchema = mongoose.Schema({
    question: {
        type: String,
        default: ""
    },
    answer: {
        type: String,
        default: ""
    },
    created_for: String

}, {
    timestamps: true
})


exports.FaqModel = mongoose.model('faq', faqSchema);