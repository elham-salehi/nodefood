const RestaurantModel = require ("../../models/Restaurant");
const {validateCreateRestaurant,validateUpdateRestaurant,loginValidator,foodValidator} = require("../validator/RestaurantValidator");
const _ =require("lodash");
const bcrypt = require("bcrypt");
const { lastIndexOf } = require("lodash");
class RestaurantController {
    async getList (req,res) {
      const list =  await RestaurantModel.find().select("name description score adminUsername pic address").limit(20);
      res.send(list);
    }
    async getListForUser(req, res) {
        const list = await RestaurantModel.find()
            .select('name description score pic address')
            .limit(20);
        res.send(list);
    }
    async getOne (req,res) {
        const id = req.params.id;
        const data = await RestaurantModel.findById(id).select("-adminPassword")
        if(!data)
            res.status(404).send("not found");
            res.send(data);
    }
    async getOneForUser(req, res) {
        const id = req.params.id;
        const data = await RestaurantModel.findById(id).select('-adminPassword -adminUsername');
        if (!data) return res.status(404).send('not found');
        res.send(data);
    }
    async addCommentToRestaurant (req,res) {
        const id = req.params.id;
        const data = await RestaurantModel.findById(id);
        if (!data) return res.status(404).send('رستوران مربوطه پیدا نشد!');
        const  body= {
            user: req.body.user,
            text: req.body.text,
            score: req.body.score
        }
        data.comment.push(body);
        await data.save();
        res.send(true);
    }
    async create (req,res) {
        const {error} = validateCreateRestaurant (req.body);
        if(error) 
           return  res.status(404).send(error.message);
           let restaurant = new RestaurantModel(_.pick(req.body,
            ['name','description','address','adminUsername','adminPassword']),
           );
           const salt = await  bcrypt.genSalt(10); 
          restaurant.adminPassword= await bcrypt.hash(restaurant.adminPassword,salt);
          restaurant= await restaurant.save();
           res.send(restaurant);
    }
    async update (req,res) {
        const id = req.params.id;
        const {error} = validateUpdateRestaurant (req.body);
        if(error) 
           return  res.status(404).send(error.message);
          const result=await RestaurantModel.findByIdAndUpdate(id,{
               $set : _.pick(req.body,[
                'name',
                'description',
                'address',
                'adminUsername',
                'adminPassword'
               ]),
           },{new:true});
           if(!result) 
                   return res.status(404).send("not found");
                   res.send(_.pick(result,[
                    'name',
                    'description',
                    'address',
                    'adminUsername',
                    'adminPassword'
                   ]));

    }
    async delete (req,res) {
        const id = req.params.id;
       await RestaurantModel.findByIdAndRemove(id);
        res.status(200).send();
    }
    async login (req,res){
        const { error } = loginValidator(req.body);
        if (error) return res.status(400).send({ message: error.message });

        let restaurant = await RestaurantModel.findOne({ adminUsername: req.body.username });
        if (!restaurant)
            return res.status(400).send({ message: 'رستورانی با این نام کاربری یا رمز عبور یافت نشد!' });

        const result = await bcrypt.compare(req.body.password,restaurant.adminPassword);
        if(!result)
            return res.status(400).send({ message: 'رستورانی با این نام کاربری یا رمز عبور یافت نشد!' })


        const token =restaurant.generateAuthToken();
        res.header("Access-Control-Expose-headers","x-auth-token").header("x-auth-token",token).status(200).send({success:true});
    }
    async addFood(req,res) {
        const restaurant = await RestaurantModel.findOne({adminUsername: req.user.username});
        if (!restaurant) return res.status(404).send("رستوران مربوطه یافت نشد!");
        const {error} = foodValidator(req.body);
        if (error) res.status(400).send(error.message);
        restaurant.menu.push({..._.pick(req.body,["name","description","price"]),pic:req.file.path});
        await restaurant.save();
        res.send("true");
    }
    async deleteFood(req,res){
        const restaurant = await RestaurantModel.findOne({adminUsername: req.user.username});
        if(!restaurant) return res.status(404).send("رستوران مربوطه یافت نشد!");
        const foodId=req.params.foodId;
       const foundFood= restaurant.menu.id(foodId);
       if(foundFood) foundFood.remove();
       await restaurant.save();
       res.send(true);
     
       }
       async updateFood(req,res){
                const restaurant = await RestaurantModel.findOne({adminUsername: req.user.username});
                if(!restaurant) return res.status(404).send("رستوران مربوطه یافت نشد!");
                const foodId=req.params.foodId;
            const foundfood= restaurant.menu.id(foodId);
            if (foundfood){
                if(req.body.name)
                foundfood.name=req.body.name;
                if(req.body.description)
                foundfood.description=req.body.description;
                if(req.body.price)
                foundfood.price=req.body.price;
            }
            await restaurant.save();
            res.send(true);
       }
    async getFoodList(req,res){
        const restaurant = await RestaurantModel.findOne({adminUsername: req.user.username});
        if(!restaurant) return res.status(404).send("رستوران مربوطه یافت نشد!");
        res.send(restaurant.menu);
       }
       async setFoodPhoto(req,res){
       
        res.send(req.file);
       }
}


module.exports =new RestaurantController;