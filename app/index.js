const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const morgan = require('morgan');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const ErrorMiddleware = require('./http/middleware/Error');
const api = require('./routes/api');
const app = express();

class Application {
    constructor(){
        this.setupExpressServer();
        this.setupMongoose();
        this.setupRoutesAndMiddlewares();
        this.setupConfigs();
    }
    setupRoutesAndMiddlewares(){
        // built-in middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('public'));

        if (app.get('env') === 'production') app.use(morgan('tiny'));
        // third-party middleware
        app.use(cors());

        //routes
        app.use("/api",api);

        app.use(ErrorMiddleware);
        
    }
    setupConfigs(){
        winston.add(new winston.transports.File({filename:'error-log.log'}));
        winston.add(new winston.transports.MongoDB({
            db: process.env.MONGODB_URI || config.get('databaseAddress'),
            level:"error"
        }))


        process.on("uncaughtException",(err) => {
            console.log(err);
            winston.error(err.message);
        });
        process.on("unhandledRejection",(err) => {
        console.log(err);
        winston.error(err.message);
        });

        app.set('view engine', 'pug');
        app.set('views', '../views'); // default
    }
    setupMongoose(){
        mongoose
        .connect(process.env.MONGODB_URI || config.get('databaseAddress') , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        })
        .then(() => {
        console.log('db connected');
        winston.info('db connected');
        })
        .catch((err) => {
        console.error('db not connected', err);
        });
    }
    setupExpressServer(){
        const port = process.env.PORT || 3000;
        app.listen(port, (err) => {
        if (err) console.log(err);
        else console.log(`app listen to port ${port}`);
});

    }
}


module.exports = Application;

