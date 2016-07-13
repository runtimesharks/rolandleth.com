/**
 * Created by roland on 2/7/16.
 */

'use strict'

const router = require('express').Router()

router.get('/', function(req, res) {
	res.render('about', {
		title: 'About',
		metadata: 'Some information about the blog. Details, résumé and contact information about Roland Leth.'
	})
})

module.exports = router
