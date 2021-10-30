const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const basketSchema = new mongoose.Schema({
    restaurantId  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "restaurant",
    },
    restaurantName : String,
    foods : [
        {
            name : String,
            foodId : String,
            price : Number,
            count : Number
        }
    ]
});

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    basket : basketSchema
});

schema.methods.generateAuthToken = function () {
    const data = {
        _id: this._id,
        role: "user",
    };

    return jwt.sign(data, config.get('jwtPrivateKey'));
};

const model = mongoose.model('user', schema);

module.exports = model;

