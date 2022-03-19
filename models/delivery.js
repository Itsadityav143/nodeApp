const mongoose= require('mongoose');

let Delivery = new mongoose.Schema({
    order_details: Object,
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    // assigned_for: {
    //     type: String,
    //     default: '1' //for full delivery
    // }, // 2 = 'pickupAdreess to warehouse' // 3 = 'warehouse  to dropAdreess'
    status: {
        type: String,
        default: 'PENDING'  //ACCEPTED //REJECTED //ONTHEWAY //DELIVERED //NOTDELIVERED //RETURNED
    },
    rejection_reason: String,
    created_time: Date
}, {
    timestamps: true
});


exports.DeliveryModel = mongoose.model('deliveries', Delivery);