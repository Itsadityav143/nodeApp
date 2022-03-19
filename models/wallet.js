var mongoose = require('mongoose')
let walletSchema = new mongoose.Schema({
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    payment_type: {
        type: String,
        enum: ["Credit", "Debit"]
    },
    transaction_type: {
        type: String,
    },
    amount: Number,
    payment_on : Number
}, {
    timestamps: true
});

exports.WalletModel = mongoose.model("Wallet", walletSchema);