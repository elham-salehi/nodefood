const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const schemeComment = new mongoose.Schema({
    user: { type: String, required: true },
    text: { type: String, required: true },
    score: Number,
});
const schemeFood = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    score: {type : Number, required : true , default : 0},
    price: { type: Number, required: false },
    pic: String,
    comments: [schemeComment],
});



const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: 0,
    },
    address: String,
    pic: String,
    comment: [schemeComment],
    menu: [schemeFood],
    adminUsername: { type: String, required: true },
    adminPassword: { type: String, required: true },
});

schema.methods.generateAuthToken = function () {
    const data = {
        _id: this._id,
        username: this.adminUsername,
        role: "restaurant",
    };

    return jwt.sign(data, config.get('jwtPrivateKey'));
};

const model = mongoose.model('restaurant', schema);

module.exports = model;

