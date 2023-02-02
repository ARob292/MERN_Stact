const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

dotenv.config({
    path:'./config.env'
});

/*===============================================================================================================
                            CONNECTION TO DATABASE
================================================================================================================*/

require('./db/conn');


app.use(express.json());

// Link the router file
app.use(require('./router/auth'));

const PORT = process.env.PORT;


/*===============================================================================================================
                           Middleware
================================================================================================================*/

const middleware = (req, res, next)=>{
    console.log('Hello from the middleware');
    next();
}


app.get('/', (req, res)=>{
    res.send('Hello world')
});
app.get('/about', middleware, (req, res)=>{
    res.send('Hello About form the server')
});
app.get('/contact', (req, res)=>{
    res.send('Hello Contact form the server')
});
app.get('/signin', (req, res)=>{
    res.send('Hello signing form the server')
});
app.get('/signup', (req, res)=>{
    res.send('Hello signup form the server')
})


app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
});