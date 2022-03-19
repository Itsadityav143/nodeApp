const {
    WalletModel
} = require('../../models/wallet')

exports.transaction_list = async (req, res) => {

    try {
        let data = await WalletModel.find().populate('receiver_id', 'first_name last_name email').populate('sender_id', 'first_name last_name email');
        return res.status(200).json({
            data: data,
            message: "Successfully"
        });

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message: error
        })

    }
}