const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require('morgan');
const mongoose = require("mongoose");
const routes = require('./routes/userRoute');



//connect to mongoose
mongoose.connect('mongodb+srv://nadine:nadineben@cluster0.cmiit.mongodb.net/Portail?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// listener to verify the DB connection
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected portaildb!!!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('tiny'));
app.use(cors());
//require route
app.use("/api", routes);

app.listen(9000, function () {
    console.log("app.listen");
    console.log("express server is running en port 9000");
})
