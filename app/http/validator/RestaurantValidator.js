const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateCreateRestaurant= (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description:Joi.string().required(),
    address:Joi.string(),
    adminUsername:Joi.string().required(),
    adminPassword:Joi.string().required(),
  });
  return schema.validate(data);
};
const validateUpdateRestaurant= (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description:Joi.string().required(),
    address:Joi.string(),
    adminUsername:Joi.string().required(),
    adminPassword:Joi.string().required(),
  });
  return schema.validate(data);
};
const loginValidator = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};
const foodValidator = (data) => {
  const schema = Joi.object({
        name:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required(),

  });
  return schema.validate(data);
};


module.exports = { validateCreateRestaurant ,validateUpdateRestaurant,loginValidator,foodValidator};
