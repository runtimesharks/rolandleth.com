/**
 * Created by roland on 6/7/16.
 */

var router = require('express').Router()
var NotFound = require('./not-found')

router.get('/', function(req, res) {
	var DBConfig = require('../lib/dbConfig')
	var config         = new DBConfig()
	config.fields      = ['body', 'title']
	config.searching   = true
	config.fieldValues = req.query.query
		.match(/\"(.*?)\"|(\w+)/g)
		.map(function(match) {
			return match.replace(/"/g, '')
		})

	var DB = require('../lib/db')
	var db = new DB()

	db.fetchPosts(config)
		.then(function(data) {
			if (data.posts.length == 0) {
				NotFound.show(res, true)
				return
			}

			res.render('partials/search', {
				posts: data.posts,
				title: 'Search results',
				page: 1,
				totalPosts: data.totalPosts,
				metadata: 'Search results'
			})
		})
		.catch(function() {
			NotFound.show(res)
		})
})

module.exports = router