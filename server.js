const express = require("express");
const morgan = require('morgan');
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cors = require("cors");
const path = require('path');
// Config dotev
require('dotenv').config({
    path: './config/config.example.env'
})



const mongoose = require("mongoose");


const app = express();

// Connect to database
connectDB();

// listener to verify the DB connection
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected portaildb!!!');
});

// body parser
app.use(bodyParser.json())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/*app.use(morgan('tiny'));
app.use(cors());*/

// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))

}

// Load routes
const routes = require('./routes/userRoute');
const productsRouter = require('./routes/productRoute');

//require route
// Use Routes
app.use("/api", routes);
app.use("/products", productsRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Page not founded"
    })
})

app.listen(9000, function () {
    console.log("app.listen");
    console.log("express server is running en port 9000");
})
