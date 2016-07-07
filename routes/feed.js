/**
 * Created by roland on 7/7/16.
 */

var router = require('express').Router()
var Feed = require('../lib/feed')

router.get('/', function(req, res) {
	Feed.create().then(function(xml) {
		res.header('Content-Type', 'text/xml')
		res.send(xml)
	})
})

module.exports = router
