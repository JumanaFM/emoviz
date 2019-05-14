const express = require("express");
const app = express();
const path = require('path');

const rsc = express.static(__dirname + "/rsc");
const src = express.static(__dirname + "/src");

app.use("/rsc", rsc);
app.use("/src", src);


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
