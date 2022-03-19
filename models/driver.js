var mongoose = require("mongoose")
const driver_schema = new mongoose.Schema({
        language: {
            type: String
        },

        delivery_provider_type: String,
        first_name: String,
        last_name: String,
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"]
        },
        city: {
            type: String
        },
        national_id: {
            front: {
                type: String
            },
            back: {
                type: String
            },
            expiry_date: {
                type: String
            }
        },
        passport: {
            front: String,
            back: String,
            expiry_date: String

        },
        home_address: {
            location: {
                type: String
            },
            city: {
                type: String
            },
            building_number: {
                type: String
            },
            landmark: {
                type: String
            }
        },
        vehicle_details: [{
            vehicle_images: [],
            vehicle_type: String,
            vehicle_model: String,
            vehicle_color: String,
            vehicle_registration: {
                front: String,
                back: String,
                expiry_date: String
            },
            vehicle_insurance: {
                front: String,
                back: String,
                expiry_date: String
            },
            driving_license: {
                front: String,
                back: String,
                expiry_date: String
            }
        }],
        bank_details: {
            iban_number: String,
            account_number: String,
            account_holder_name: String,
            bank_name: String,
            branch_name: String,
            bank_address: String,
            city: String,
            country: String,
            postal_code: String,
        },
        email: {
            type: String
        },
        mobile_number: {
            type: String
        },
        password: {
            type: String
        },
        access_token: {
            type: String,
            require: true
        },
        verification_code: {
            type: String,
        },
        country_code: {
            type: String
        },
        device_token: {
            type: String,
            default: ""
        },
        device_type: {
            type: String,
            default: 0
        },
        is_verified: {
            type: Boolean,
            default: 0
        },
        is_online: {
            type: Boolean,
            default: 0
        },
        profile_image: {
            type: String,
            default: 0
        },
        distance_in_miles: {
            type: Number
        },

        date_of_birth: String,
        is_approved_by_admin: {
            type: String,
            default: "0" //0==pending , 1==approved , 2 ==disapproved
        },
        is_blocked: {
            type: Boolean,
            default: 0
        },
        location: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: [Number],
            default: [0, 0]
        },
        lat: {
            type: String,
            default: '27.8974'
        },
        long: {
            type: String,
            default: '78.0880'
        },
        is_profile_completed: {
            type: String,
            default: '0'
        },
        enable_orders: {
            type: Boolean,
            default: false
        },
        payment_method: {
            type: String,
            default: ""
        },
        currently_assigned_order: {
            type: Boolean,
            default: false
        }
    }, {
        timestamps: true
    }

)

driver_schema.index({
    location: "2dsphere"
});

exports.driverModel = mongoose.model('driver', driver_schema);