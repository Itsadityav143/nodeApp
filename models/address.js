var mongoose = require('mongoose')
const AddressSchema = new mongoose.Schema({
    address_name: {
        type: String,
        default: ""
    },
    house_number: {
        type: String,
        default: ""
    },
    building_tower: {
        type: String,
        default: ""
    },
    society: {
        type: String,
        default: ""
    },
    pincode: {
        type: String,
        default: "",
    },
    address_type: {
        type: Number,
        default: 1,
    },
    lat: {
        type: String,
        default: '27.8974'
    },
    long: {
        type: String,
        default: '78.0880'
    },

    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
        default: [0, 0]
    },
    location_address: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }



}, {
    timestamps: true
})

AddressSchema.index({
    location: "2dsphere"
});


exports.AddressModel = mongoose.model("Address", AddressSchema);