/**
 * Created by roland on 2/7/16.
 */

var router = require('express').Router()

router.get('/', function(req, res) {
	res.render('../views/about.ejs')
})

module.exports = router