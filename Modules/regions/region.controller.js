const {
    RegionModel
} = require('../../models/region')
const {
    Countries
} = require('../../models/countries')
let commonFunc = require("../../common/utility")

exports.AddCountry = async (req, res) => {
    try {
        let contestData = await Countries.create(req.body)
        res.status(200).json({
            data: contestData,
            message: "Successfully created Country"
        })
    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
}

exports.getCountry = async (req, res) => {
    try {

        let count = await Countries.find({}).sort({
            _id: -1
        })

        res.status(200).json({
            data: count
        })
    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
}

exports.AddRegion = async (req, res) => {
    try {
        let {
            name,
            Country,
            geometry,
            lat,
            long
        } = req.body

        if (typeof geometry === 'string')
            geometry = JSON.parse(geometry)


        let regionData = await RegionModel.create({
            name: name,
            Country: Country,
            lat: lat,
            long: long,
            geometry: geometry

        })

        if (!regionData)
            return res.status(400).json({
                message: e.message
            });

        res.status(200).json({
            data: regionData,
            message: "Successfully created Region"
        })
    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
}


exports.updateRegion = async (req, res) => {
    try {
        let {
            name,
            Country,
            geometry,
            region_id
        } = req.body

        let regionData = await RegionModel.findByIdAndUpdate(region_id, req.body, {
            new: true
        })

        res.status(200).json({
            data: regionData,
            message: "Region Updated Successsfully"
        })

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
}


exports.deleteRegion = async (req, res) => {
    try {
        let {
            region_id
        } = req.body


        let regionData = await RegionModel.findByIdAndRemove(region_id)
        res.status(200).json({
            data: regionData,
            message: "Region Removed Successsfully"
        })

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
}

exports.getCountryRegion = async (req, res) => {
    try {
        let {
            Country
        } = req.body

        let query = {}

        if (Country)
            query['Country'] = Country

        let regionData = await RegionModel.find(query).populate("Country");

        res.status(200).json({
            data: regionData,
        })


    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
}



exports.isinsideIntheRegion = async (req, res) => {
    try {
        let {
            lat,
            long
        } = req.body

        let regionData = await RegionModel.find({
            geometry: {
                $geoIntersects: {
                    $geometry: {
                        "type": "Point",
                        "coordinates": [Number(long), Number(lat)]
                    }
                }
            }
        }, {
            geometry: 0
        }).lean(true)

        res.status(200).json({
            data: regionData,
        })

    } catch (e) {
        handleError(res, e);
    }
}