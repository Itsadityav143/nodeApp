const {
    BannerModelHome
} = require('../../models/banner_for_home_screen')

exports.getBanner = async (req, res) => {

    try {

        let query = {}

        if (req.query.bannerId)
            query._id = bannerId


        let data = await BannerModelHome.find(query)

        res.status(200).json({
            message: "successful.",
            data: data
        });

    } catch (error) {
        res.status(403).error(error.message);
    }
}


exports.updateBanner = async (req, res) => {

    try {

        let updatedField = await BannerModelHome.findByIdAndUpdate(req.body.bannerId, req.body, {
            new: true
        })
        if (!updatedField)
            throw new Error('Not Found')

        res.status(200).json({
            message: "Banner Updated successful.",
            data: updatedField
        });

    } catch (error) {
        res.status(403).error(error.message);
    }
}

exports.createBanner = async (req, res) => {
    try {

        let field = await BannerModelHome.create(req.body)

        return res.status(200).json({
            message: "Banner Created successful.",
            data: field
        });

    } catch (error) {
        res.status(403).error(error.message);
    }

}
exports.deleteBanner = async (req, res) => {
    try {

        let promoData = await BannerModelHome.findOneAndRemove({
            _id: req.body.bannerId
        })


        res.status(200).json({
            data: promoData,
            message: "Banner delete successfully"
        })

    } catch (error) {
        res.status(403).error(error.message);
    }
}