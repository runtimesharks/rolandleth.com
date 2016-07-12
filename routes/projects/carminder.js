/**
 * Created by roland on 4/7/16.
 */

'use strict'

const router = require('express').Router()

router.get('/', function(req, res) {
	res.render('carminder')
})

router.get('/press-kit', function(req, res) {
	res.download('./assets/files/Carminder Press Kit.zip', 'Carminder Press Kit.zip')
})

module.exports = router
