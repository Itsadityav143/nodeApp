const {
    superMarketModel
} = require('../../models/superMarketUser')

const {
    ContentModel
} = require('../../models/contentModel')

const {
    superMarketBannerModel
} = require('../../models/superMarketBanner')

const {
    superMarketOfferModel
} = require('../../models/superMarketOffer')

const {
    FaqModel
} = require('../../models/faqModel')
const {
    superMarketCategoryModel
} = require('../../models/superMarketCategory')
exports.get_superMarkets_list = async function (req, res) {
    try {
        let status = {}
        if (req.query.status)
            status.is_approved_by_admin = req.query.status

        return res.status(200).json({
            data: await superMarketModel.find(status).sort({
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

exports.approve_disapprove_superMarket = async (req, res) => {

    try {
        var superMarket = await superMarketModel.findByIdAndUpdate(req.body._id, {
            is_approved_by_admin: req.body.is_approve
        }, {
            new: true
        })
        if (superMarket) {
            return res.status(200).json({
                data: superMarket,
                message: "success"
            });
        } else
            return res.status(200).json({
                message: "superMarket not exist"
            });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.delete_superMarket = async function (req, res) {
    try {
        let superMarket = await superMarketModel.findOneAndDelete({
            _id: req.body._id
        });
        if (superMarket) {
            return res.status(200).json({
                data: superMarket,
                message: "Deleted"
            });
        } else
            return res.status(403).json({
                message: "superMarket not exist"
            });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.block_superMarket = async (req, res) => {
    try {
        var superMarket = await superMarketModel.findByIdAndUpdate(req.body._id, {
            is_blocked: req.body.is_blocked
        }, {
            new: true
        })
        if (superMarket) {
            return res.status(200).json({
                data: superMarket,
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


//*****************category*********************** */

exports.add_category = async (req, res) => {
    try {
        let exist = await superMarketCategoryModel.findOne({
            category: req.body.category
        });
        if (exist) return res.status(200).json({
            message: "categorie already exist"
        })
        let data = await superMarketCategoryModel.create(req.body)
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

exports.update_category = async (req, res) => {
    try {
        let data = await superMarketCategoryModel.findOneAndUpdate({
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

exports.delete_category = async (req, res) => {
    try {
        let data = await superMarketCategoryModel.findByIdAndDelete(req.body._id)

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

exports.get_category = async (req, res) => {
    try {
        let data = await superMarketCategoryModel.find()

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


exports.create_banner = async (req, res) => {
    try {
        if (!req.body.image) return res.status(403).json({
            message: "image is missing"
        })
        let data = await superMarketBannerModel.create(req.body)
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

        let data = await superMarketBannerModel.findOneAndUpdate({
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
        let data = await superMarketBannerModel.findByIdAndDelete(req.body._id)

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
        let data = await superMarketBannerModel.find()

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

//**********offer management */

exports.add_offer = async (req, res) => {
    try {
        if (typeof req.body.offer_validity == 'string')
            req.body.offer_validity = JSON.parse(req.body.offer_validity)

        let is_exist = await superMarketOfferModel.findOne({
            offer_code: req.body.offer_code,
            created_by: "ADMIN"
        })
        if (is_exist)
            return res.status(403).json({
                message: "Offer Code Already Exist"
            })
        let bodyData = req.body
        bodyData.created_by = "ADMIN"
        let offer = await superMarketOfferModel.create(bodyData)
        return res.status(200).json({
            data: offer,
            message: "Success"
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

        let offer = await superMarketOfferModel.findByIdAndUpdate(req.body._id, req.body, {
            new: true
        })
        return res.status(200).json({
            data: offer,
            message: "Success"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.delete_offer = async (req, res) => {
    try {
        let offer = await superMarketOfferModel.findByIdAndDelete(req.body._id)
        return res.status(200).json({
            data: offer,
            message: "Deleted"
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
        let offer = await superMarketOfferModel.find(query)
        return res.status(200).json({
            data: offer,
            message: "Success"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.createFaq = async (req, res) => {
    try {
        let exist_panels = ["SUPERMARKET", "STORE", "USER", "DRIVER", "RESTAURANT"]
        if (!exist_panels.includes(req.body.created_for)) {
            return res.status(403).json({
                message: "Use only // SUPERMARKET, STORE, USER, DRIVER, RESTAURANT",
            });
        }
        let faq = await FaqModel.create(req.body)
        return res.status(200).json({
            message: "FAQ create successfully",
            data: faq
        });

    } catch (error) {
        res.status(403).json(error.message)
    }
}

exports.updateFaq = async (req, res) => {
    try {
        let getUserdata = await FaqModel.findByIdAndUpdate(req.body.faqId, req.body, {
            new: true
        })
        return res.status(200).json({
            message: "FAQ updated successfully",
            data: getUserdata
        });

    } catch (error) {
        res.status(400).json(error.message);
    }
}


exports.removeFaq = async (req, res) => {
    try {
        let getUserdata = await FaqModel.findByIdAndRemove(req.body.faqId)

        res.status(200).json({
            message: "removed successfully",
            data: getUserdata
        });

    } catch (error) {
        res.status(400).json(error.message);
    }
}

exports.getFaq = async (req, res) => {
    try {
        let query = {}
        if (req.query.created_for) {
            query.created_for = req.query.created_for
        }
        let Faq = await FaqModel.find(query);

        res.status(200).json({
            message: "Success",
            data: Faq
        });
    } catch (error) {
        res.status(403).error(error.message);
    }
}

exports.createContent = async (req, res) => {
    try {

        let exist_panels = ["SUPERMARKET", "STORE", "USER", "DRIVER", "RESTAURANT"]

        if (!exist_panels.includes(req.body.created_for)) {
            return res.status(403).json({
                message: "Use only // SUPERMARKET, STORE, USER, DRIVER, RESTAURANT",
            });
        }
        let query = {
            created_for: req.body.created_for
        };
        query[req.query.contentHeading] = req.body.contentText


        let contentC = await ContentModel.findOneAndUpdate({
            created_for: req.body.created_for
        }, query, {
            new: true
        });
        if (!contentC) {
            contentC = await ContentModel.create(query)
        }
        return res.status(200).json({
            message: "Successfully Created ",
            data: contentC
        });

    } catch (error) {
        res.status(403).error(error.message);
    }
}


exports.readContent = async (req, res) => {
    try {
        let exist_panels = ["SUPERMARKET", "STORE", "USER", "DRIVER", "RESTAURANT"]

        if (!exist_panels.includes(req.query.created_for)) {
            return res.status(403).json({
                message: "Use only // SUPERMARKET, STORE, USER, DRIVER, RESTAURANT",
            });
        }
        let data = await ContentModel.findOne({
            created_for: req.query.created_for
        });

        res.send(data[req.query.contentHeading])


    } catch (error) {
        res.status(403).error(error.message);
    }
}