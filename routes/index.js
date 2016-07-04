/**
 * Created by roland on 1/7/16.
 */

var router = require('express').Router()

router.get('/', function(req, res) {
	var DB = require('../lib/db')
	var db = new DB()
	
	db.fetchPosts().then(function(data) {
		res.render('index.ejs', {
			posts: data,
			title: 'Roland Leth',
			metadata: 'Development thoughts by Roland Leth'
		})
	})
})

module.exports = router