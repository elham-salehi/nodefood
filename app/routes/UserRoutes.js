const router = require('express').Router();
const controller = require('../http/controller/RestaurantController');
const userController = require('../http/controller/UserController');

const Auth = require("../http/middleware/Auth")
const User = require("../http/middleware/User")

router.post('/login', userController.login);
router.post('/register', userController.register);



router.get('/restaurantList', controller.getListForUser);
router.get('/restaurantDetail/:id', controller.getOneForUser);

router.post("/addCommentRestaurant/:id",controller.addCommentToRestaurant);

router.post("/updateBasket",[Auth,User],userController.updateBasket);
router.get("/getBasket",[Auth,User],userController.getBasket);

router.get("/checkoutBasket",[Auth,User],userController.checkoutBasket);
router.get("/verifyPayment",userController.verifyPayment);
router.get("/payment/:paymentCode",userController.getPaymentDetail);


module.exports = router;
