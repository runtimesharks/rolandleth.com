/**
 * Created by roland on 1/7/16.
 */

var router = require('express').Router()

router.get('/', function(req, res) {
	res.render('index.ejs', {
		title: 'Roland Leth',
		metadata: 'Development thoughts by Roland Leth'
	})
})

module.exports = router