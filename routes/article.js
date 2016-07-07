/**
 * Created by roland on 6/7/16.
 */

var router   = require('express').Router()
var NotFound = require('./not-found')
var DB = require('../lib/db')

router.get('/', function(req, res) {
	var config         = new DB.Config()
	config.fields      = 'link'
	config.fieldValues = [req.baseUrl.substring(1)]
	config.limit       = 1

	DB.fetchPosts(config)
		.then(function(data) {
			if (data.posts.length == 0) {
				NotFound.show(res)
				return
			}

			var post = data.posts
			res.render('index', {
				posts: post,
				title: post.title,
				page: 1,
				totalPosts: 1,
				metadata: post.title
			})
		})
		.catch(function() {
			NotFound.show(res)
		})
})

module.exports = router
