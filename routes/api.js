var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var usersFilePath = path.join((process.cwd()+'/'+'files'), 'test.json');

/* GET  */
router.get('/', function(req, res, next) {
    var readable = fs.createReadStream(usersFilePath);
    readable.pipe(res);
});

module.exports = router;

