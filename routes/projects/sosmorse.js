/**
 * Created by roland on 4/7/16.
 */

'use strict'

var router = require('express').Router()

router.get('/', function(req, res) {
	res.render('sosmorse')
})

module.exports = router
