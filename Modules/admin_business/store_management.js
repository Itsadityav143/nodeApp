const {
    branchModel
} = require('../../models/branch')
 
const {
    GroceryOrdersModel
} = require('../../models/groceryOrders')

exports.get_grocery_orders = async function (req, res) {
    try {
        let data = await GroceryOrdersModel.find().sort({
            _id: -1
        })
        return res.status(200).json({
            data: data,
            message: "Successfully"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}
