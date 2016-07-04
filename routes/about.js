/**
 * Created by roland on 2/7/16.
 */

var router = require('express').Router()

router.get('/', function(req, res) {
	res.render('../views/about.ejs', {
		title: 'About',
		metadata: 'Some information about the blog. Details, résumé and contact information about Roland Leth.'
	})
})

module.exports = router