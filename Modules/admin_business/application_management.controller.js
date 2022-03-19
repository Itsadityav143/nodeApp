const {
    query
} = require('express')
const {
    moduleModel
} = require('../../models/modules')
const {
    RestaurantModel
} = require('../../models/restaurant')
const {
    offerModel
} = require('../../models/offer')

exports.create_module = async (req, res) => {

    try {
        let module = req.body
        console.log(module)
        if (module) {
            let data = await moduleModel.create(module)
            return res.status(200).json({
                data: data,
                message: "Successfully"
            });
        } else
            return res.status(403).json({
                data: null,
                message: "something is missing"
            });



    } catch (error) {

    }

}


exports.get_module = async function (req, res) {
    try {
        let module = await moduleModel.find({});
        return res.status(200).json({
            data: module,
            message: "Successfully"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.delete_module = async (req, res) => {
    try {

        let module = await moduleModel.findOneAndDelete({
            _id: req.body._id
        })
        if (module) {
            return res.status(200).json({
                data: module,
                message: "deleted"
            });
        } else
            res.status(403).json({
                data: null,
                message: "not find"
            });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }

}

exports.update_module = async (req, res) => {

    try {
        let data = req.body
        let module = await moduleModel.findByIdAndUpdate(req.body._id, data, {
            new: true
        }).exec();

        if (module) {
            return res.status(200).json({
                data: module,
                message: "updated"
            });
        } else
            res.status(403).json({
                data: null,
                message: "not find"
            });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

}

exports.get_restaurent_list = async (req, res) => {

    try {

        let query = {}
        if (req.query.status)
            query.is_approved_by_admin = req.query.status

        let data = await RestaurantModel.find(query).populate('categories')

        return res.status(200).json({
            data: data,
            message: "success"
        })

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}


exports.approve_disapprove_restaurant = async (req, res) => {


    try {
        var restaurant = await RestaurantModel.findByIdAndUpdate(req.body._id, {
            is_approved_by_admin: req.body.is_approve
        }, {
            new: true
        })
        if (restaurant) {
            return res.status(200).json({
                data: restaurant,
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



//*************************offer management*************** */

exports.add_offer = async (req, res) => {
    try {
        let exist = await offerModel.findOne({
            offer_name: req.body.offer_name,
            created_by: "ADMIN"
        })
        if (typeof req.body.offer_validity == 'string')
            req.body.offer_validity = JSON.parse(req.body.offer_validity)

        if (exist)
            return res.status(403).json({
                message: "Offer Already Exist"
            })

        req.body.created_by = "ADMIN"
        let offer = await offerModel.create(req.body)

        return res.status(200).json({
            data: offer,
            message: "success"
        })


    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.update_offer = async (req, res) => {
    try {
        if (typeof req.body.offer_validity == 'string')
            req.body.offer_validity = JSON.parse(req.body.offer_validity)

        let offer = await offerModel.findOneAndUpdate({
                _id: req.body._id
            },
            req.body, {
                new: true
            })
        if (offer) return res.status(200).json({
            data: offer,
            message: "updated"
        })
        else return res.status(403).json({
            message: "Not Found"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.delete_offer = async (req, res) => {
    try {
        let offer = await offerModel.findOneAndDelete({
            _id: req.body._id
        })
        if (offer) return res.status(200).json({
            data: offer,
            message: "Deleted"
        })
        else return res.status(403).json({
            message: "Not Found"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.get_offers = async (req, res) => {
    try {
        let query = {
            created_by: "ADMIN"
        }
        if (req.query.is_active)
            query.is_active = req.query.is_active
        let offer = await offerModel.find(query)
        return res.status(200).json({
            data: offer,
            message: "success"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}





exports.create_banner = async (req, res) => {
    try {
        if (!req.body.image) return res.status(403).json({
            message: "image is missing"
        })
        let data = await restaurantBannerModel.create(req.body)
        return res.status(200).json({
            data: data,
            message: "success"
        })
    } catch (e) {
        return res.status(403).json({
            message: e.message
        })
    }
}

exports.update_banner = async (req, res) => {
    try {

        let data = await restaurantBannerModel.findOneAndUpdate({
            _id: req.body._id
        }, req.body, {
            new: true
        })
        return res.status(200).json({
            data: data,
            message: "success"
        })
    } catch (e) {
        return res.status(403).json({
            message: e.message
        })
    }
}

exports.delete_banner = async (req, res) => {
    try {
        let data = await restaurantBannerModel.findByIdAndDelete(req.body._id)

        return res.status(200).json({
            data: data,
            message: "success"
        })
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}

exports.get_banners = async (req, res) => {
    try {
        let data = await restaurantBannerModel.find()

        return res.status(200).json({
            data: data,
            message: "success"
        })
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}