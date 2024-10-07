const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
var bodyparser = require("body-parser");
const configdb = require("./config/database");
const app = express();

app.use(cors({
    origin: '*'
}));
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

dotenv.config({path : './config/.env'})
configdb();

app.use(require('./controllers/superadmin'));
app.use(require('./controllers/employee'));
app.use(require('./controllers/siteadmin'));

app.listen(4200,() => {
    console.log("server is running on port 4200");
});