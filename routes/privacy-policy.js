/**
 * Created by roland on 4/7/16.
 */

'use strict'

const router = require('express').Router()

router.get('/', function(req, res) {
	res.render('privacy-policy', {
		title: 'Privacy Policy',
		metadata: 'Roland Leth\'s privacy policy'
	})
})

router.get('/download', function(req, res) {
	res.download('./assets/files/Privacy Policy.md', 'Roland Leth Privacy Policy.md')
})

module.exports = router
