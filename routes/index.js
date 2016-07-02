/**
 * Created by roland on 1/7/16.
 */

var router = require('express').Router()

router.get('/', function(req, res) {
	res.render('../views/index.ejs')
})

module.exports = router