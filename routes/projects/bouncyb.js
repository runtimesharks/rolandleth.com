/**
 * Created by roland on 4/7/16.
 */

var router = require('express').Router()

router.get('/', function(req, res) {
	res.render('bouncyb.ejs')
})

module.exports = router