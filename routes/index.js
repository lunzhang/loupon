var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../ng/index.html'));
});
router.get('/ng2', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../ng2/index.html'));
});

module.exports = router;
