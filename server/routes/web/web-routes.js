let webRouter = require('express').Router();
webRouter.get('/', function (req, res) {
    res.render("home");
});

module.exports = webRouter;