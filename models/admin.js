var mongoose = require('mongoose')
var adminSchema = mongoose.Schema({
    access_token: {
        type: String,
        require: true
    },
    email: {
        type: String,
    },
    access: {
        type: Array,
        default: ['all']
    },
    is_delete: {
        type: String,
        default: '0'
    },
    is_role_assigned: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
    },
    profile_image: {
        type: String,
        default: null
    },
    verification_code: {
        type: String,
    },
    name: {
        type: String,
    },
    city: {
        type: String,
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    mobile_number: {
        type: String,
    },

}, {
    timestamps: true
})

var Admin = mongoose.model('Admin', adminSchema)

Admin.findOne({}).then((res) => {
    if (!res)
        Admin.create({
            email: "admin@gmail.com",
            password: "25d55ad283aa400af464c76d713c07ad"
        })
})

exports.AdminModel = Admin
exports.adminModel = mongoose.model('admin', adminSchema);