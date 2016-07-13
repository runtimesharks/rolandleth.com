/**
 * Created by roland on 7/7/16.
 */

'use strict'

const router = require('express').Router()
const SiteMap = require('../lib/sitemap')

router.get('/', function(req, res) {
	SiteMap.create().then(function(xml) {
		res.header('Content-Type', 'text/xml')
		res.send(xml)
	})
})

module.exports = router
