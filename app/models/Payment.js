const mongoose = require('mongoose');

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
  user: {
    _id : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "user",
    },
    name: String,
  },
  basket : basketSchema,
  paymentCode : String,
  success : {
    type : Boolean,
    default : false,
  },
  amount : Number,
  refId : String
});


const model = mongoose.model('payment', schema);

module.exports = model;

