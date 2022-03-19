const {
    cuisineModel
} = require('../../models/cuisine')


exports.create_cuisine = async (req, res) => {

    try {
        let cuisine = req.body
        console.log(cuisine)
        if (cuisine) {
            let data = await cuisineModel.create(cuisine)
            return res.status(200).json({
                data: data,
                message: "Successfully"
            });
        } else
            return res.status(400).json({
                data: null,
                message: "something is missing"
            });



    } catch (error) {

    }

}


exports.get_cuisine = async function (req, res) {
    try {
        let cuisine = await cuisineModel.find({});
        return res.status(200).json({
            data: cuisine,
            message: "Successfully"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.delete_cuisine = async (req, res) => {
    try {

        let cuisine = await cuisineModel.findOneAndDelete({
            _id: req.body._id
        })
        if (cuisine) {
            return res.status(200).json({
                data: cuisine,
                message: "deleted"
            });
        } else
            res.status(400).json({
                data: null,
                message: "not find"
            });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }

}

exports.update_cuisine = async (req, res) => {

    try {
        let data = req.body
        let cuisine = await cuisineModel.findByIdAndUpdate(req.body._id, data, {
            new: true
        }).exec();

        if (cuisine) {
            return res.status(200).json({
                data: cuisine,
                message: "updated"
            });
        } else
            res.status(400).json({
                data: null,
                message: "not find"
            });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

}