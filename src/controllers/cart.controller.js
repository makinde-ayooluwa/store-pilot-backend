const Cart = require("../models/cart.model");
const User = require("../models/user.model")
const addToCart = async(req, res)=>{
    try {
        const {user, items} = req.body;
        if(user == ""){
            return res.status(400).json({
                status: false,
                message: "User ID is required"
            })
        }
        const userExists = await User.findById(user);
        if(!userExists){
            return res.status(400).json({
                status: false,
                message: "User ID not recognized"
            })
        }
        if(items.length < 1){
            return res.status(400).json({
                status: false,
                message: "Cart items can't be empty"
            })
        }
        const exists = await Cart.findOne({user});
        if(exists){
            items.map((item)=> exists.item.push(item));
            exists.save();
            return res.status(200).json({
                status: false,
                message: "Added to cart successfully"
            })
        }
    } catch (error) {
        
    }
}

module.exports = { addToCart }