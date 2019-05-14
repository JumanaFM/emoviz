
const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');
var cors = require('cors')
const app = express();
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");


app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
configRoutes(app);

app.listen(3002, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3002");
});
