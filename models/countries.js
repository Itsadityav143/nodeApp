var mongoose = require('mongoose')
const Countries = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    code: String,
    currency: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
});

let countriesmodel = mongoose.model('Countries', Countries);

countriesmodel.find({}).then(async (data) => {
    if (!data.length)
        await countriesmodel.create({
            name: "India"
        })

})

exports.Countries = countriesmodel