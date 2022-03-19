const {
    driverModel
} = require('../../models/driver')

exports.get_drivers_list = async function (req, res) {
    try {
        let status = {}
        if (req.query.status)
            status.is_approved_by_admin = req.query.status
        if (req.query.delivery_provider_type)
            status.delivery_provider_type = req.query.delivery_provider_type
        return res.status(200).json({
            data: await driverModel.find(status).sort({
                _id: -1
            }),
            message: "Successfully"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.approve_disapprove_driver = async (req, res) => {

    try {
        var driver = await driverModel.findByIdAndUpdate(req.body._id, {
            is_approved_by_admin: req.body.is_approve
        }, {
            new: true
        })
        if (driver) {
            return res.status(200).json({
                data: driver,
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

exports.delete_driver = async function (req, res) {
    try {
        let driver = await driverModel.findOneAndDelete({
            _id: req.body._id
        });
        if (driver) {
            return res.status(200).json({
                data: driver,
                message: "Deleted"
            });
        } else
            return res.status(403).json({
                message: "driver not exist"
            });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.block_driver = async (req, res) => {
    try {
        var driver = await driverModel.findByIdAndUpdate(req.body._id, {
            is_blocked: req.body.is_blocked
        }, {
            new: true
        })
        if (driver) {
            return res.status(200).json({
                data: driver,
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