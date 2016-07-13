/**
 * Created by roland on 4/7/16.
 */

'use strict'

const router = require('express').Router()

router.get('/', function(req, res) {
	res.render('bouncyb')
})

module.exports = router
