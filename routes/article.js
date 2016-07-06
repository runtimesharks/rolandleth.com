/**
 * Created by roland on 6/7/16.
 */

var router   = require('express').Router()

router.get('/', function(req, res) {
	var DBConfig = require('../lib/dbConfig')
	var config         = new DBConfig()
	config.fields      = 'link'
	config.fieldValues = [req.baseUrl.substring(1)]
	config.limit       = 1

	var DB = require('../lib/db')
	var db = new DB()

	db.fetchPosts(config)
		.then(function(data) {
			if (data.posts.length == 0) {
				show404(res)
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
			show404(res)
		})
})

function show404(res) {
	res.render('not-found', {
		title: '404',
		metadata: 'Development thoughts by Roland Leth'
	})
	res.end()
}

module.exports = router