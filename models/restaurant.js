var mongoose = require('mongoose')
const RestaurantSchema = new mongoose.Schema({
    owner_name: {
        type: String
    },
    is_profile_completed: {
        type: Boolean,
        default: 0 //0 not completed 1 Completed
    },
    restaurant_images: [],
    restaurant_on: {
        type: Boolean,
        default: 0
    },
    restaurant_contact: String,
    document_type: String,
    upload_first: String,
    upload_second: String,
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "cuisines"
    }],
    food_type: [],
    service_type: String, //1 delivery //2 self pickup //3 both
    self_pickup_time: String,
    email: {
        type: String
    },
    mobile_number: {
        type: String
    },
    country_code: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    date_of_birth: String,
    password: {
        type: String
    },
    restaurant_name: {
        type: String
    },
    restaurant_about: {
        type: String
    },
    lat: {
        type: String,
        default: '27.8974'
    },
    long: {
        type: String,
        default: '78.0880'
    },
    distance_in_miles: String,
    //food_prepare_timing: Number, // in minutes
    expected_delivery_time: Number, // in minutes
    minimum_order: String,
    restaurant_location: String,
    offer_count: {
        type: Number,
        default: 0
    },
    profile_image: String,
    is_blocked: {
        type: Boolean,
        default: 0
    },
    access_token: {
        type: String
    },
    verification_code: {
        type: String
    },
    device_type: {
        type: String,
        default: 0
    },
    device_token: {
        type: String,
        default: ""
    },
    is_approved_by_admin: {
        type: String,
        default: "0" //0==pending , 1==approved , 2 ==disapproved
    },
    is_verified: {
        type: Boolean,
        default: 0
    },
    is_reserved_enabled: {
        type: Boolean,
        default: 0
    },
    no_of_seat: Number,
    price_for_two: Number,
    time_slot: [],
    working_hours: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },
        start_time: String, //Should be in 24 hr Format
        end_time: String, //Should be in 24 hr Format
        is_holyday: {
            type: Boolean,
            default: false
        }
    }],
    bank_detail: {
        bank_name: String,
        account_holder_name: String,
        account_number: String,
        ifsc: String,
    },
    is_offline: {
        type: Boolean,
        default: false
    },
    banner_image: {
        type: String,
    },
    enable_orders: {
        type: Boolean,
        default: false
    },
    active_inactive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


RestaurantSchema.index({
    '$**': 'text'
});

exports.RestaurantModel = mongoose.model("Restaurant", RestaurantSchema);