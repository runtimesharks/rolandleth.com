/**
 * Created by roland on 7/7/16.
 */

var router = require('express').Router()
var SiteMap = require('../lib/sitemap')

router.get('/', function(req, res) {
	SiteMap.create().then(function(xml) {
		res.header('Content-Type', 'text/xml')
		res.send(xml)
	})
})

module.exports = router
