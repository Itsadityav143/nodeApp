var mongoose = require("mongoose");

let Content = mongoose.Schema({
    privacyPolicy: String,
    termsAndConditions: String,
    aboutUs: String,
    help: String,
    contactUs: String,

    created_for: String


})

exports.ContentModel = mongoose.model('content', Content);