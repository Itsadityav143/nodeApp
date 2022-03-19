var mongoose = require('mongoose')



let Notificationchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    created_at: {
        type: Number,
        default: Date.now()
    },
    notification_type: String,
    is_read: {
        type: Boolean,
        default: 0
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        default: null
    },
    body: {
        type: String
    },
    title: {
        type: String
    },
}, {
    timestamps: true,
    strict: true,
    collection: 'Notifications',
    versionKey: false
});
exports.NotificationModel = mongoose.model('Notifications', Notificationchema);