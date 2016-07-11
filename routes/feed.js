/**
 * Created by roland on 7/7/16.
 */

'use strict'

var router = require('express').Router()
const Feed = require('../lib/feed')

router.get('/', function(req, res) {
	Feed.create().then(function(xml) {
		res.header('Content-Type', 'text/xml')
		res.send(xml)
	})
})

module.exports = router
