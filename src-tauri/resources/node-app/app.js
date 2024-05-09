var express = require("express");
var app = express();

const PORT = 5050;

app.get("/", function (req, res) {
    res.send("Hello World from Express! :)");
});
app.listen(PORT, function () {
    console.log("Example app listening on port %d!", PORT);
});
