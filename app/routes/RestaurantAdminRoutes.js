const multer = require("multer");
const router = require('express').Router();
const controller = require('../http/controller/RestaurantController');

const Auth = require("../http/middleware/Auth")
const RestaurantAdmin = require("../http/middleware/RestaurantAdmin")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,  Date.now()+"-"+file.originalname)
    }
})

var upload = multer({ storage: storage })

router.post('/login', controller.login);

router.post("/foods/addFood",[Auth,RestaurantAdmin,upload.single("foodPhoto")],controller.addFood)
router.delete("/foods/deleteFood/:foodId",[Auth,RestaurantAdmin],controller.deleteFood)
router.put("/foods/updateFood/:foodId",[Auth,RestaurantAdmin],controller.updateFood)
router.get("/foods/getFoodList",[Auth,RestaurantAdmin],controller.getFoodList)


module.exports = router;
