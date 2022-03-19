const mongoose = require('mongoose');

let groceryDelivery = new mongoose.Schema({
    order_details: Object,
    groceryOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groceryOrders'
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
        default: 'PENDING' //ACCEPTED //REJECTED // ARRIVEDATSTORE //ORDERPICKEDUP //REACHEDCUSTOMERLOCATION //DELIVERED //NOTDELIVERED //RETURNED
    },
    rejection_reason: String,
    created_time: Date
}, {
    timestamps: true
});


exports.groceryDeliveryModel = mongoose.model('groceryDelivery', groceryDelivery);