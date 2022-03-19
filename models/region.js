var mongoose = require('mongoose')
const Region = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    Country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Countries',
        default: null
    },
    "geometry": {
        type: {
            type: String,
            default: 'Polygon'
        },
        coordinates: [],
    },
    lat: Number,
    long: Number
}, {
    timestamps: true
});


Region.statics.createContact = async function (new_contact) {
    return await this.create(new_contact);
}


Region.statics.findRegion = async function (lat, long) {

    let regionData = await this.find({
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

    return regionData
}

Region.index({
    "geometry": "2dsphere"
});

exports.RegionModel = mongoose.model('Regions', Region);