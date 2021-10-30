const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = (req, res, next) => {
   const token = req.header('x-auth-token');
   if(!token) 
     return res.status(401).send('شما اجازه دسترسی به این دیتا را ندارید!');
     try{
         const user = jwt.verify(token,config.get('jwtPrivateKey'));
         req.user=user;
         next();
     }catch(ex){
        return res.status(401).send('شما اجازه دسترسی به این دیتا را ندارید!');
     }
  };