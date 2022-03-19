const {
    UserModel
} = require('../../models/user')


exports.get_user_list = async function (req, res) {
    try {
        let users = await UserModel.find({});
        return res.status(200).json({
            data: users,
            message: "Successfully"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}


exports.delete_user = async function (req, res) {
    try {
        let users = await UserModel.findOneAndDelete({
            _id: req.body._id
        });
        if (users) {
            return res.status(200).json({
                data: users,
                message: "Deleted"
            });
        } else
            return res.status(403).json({
                message: "user not exist"
            });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.block_user = async (req, res) => {
    let temp = req.body.is_blocked
    let is_blocked = false

    // string to boolean
    if (temp == "1") {
        is_blocked = true

    } else if (temp == "0") {
        is_blocked = false
    }


    try {
        console.log("blocked " + is_blocked)
        var user = await UserModel.findByIdAndUpdate(req.body._id, {
            is_blocked: is_blocked
        }, {
            new: true
        })
        if (user) {
            return res.status(200).json({
                data: user,
                message: "success"
            });
        } else
            return res.status(200).json({
                message: "user not exist"
            });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}