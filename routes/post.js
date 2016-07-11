/**
 * Created by roland on 6/7/16.
 */

'use strict'

var router   = require('express').Router()
const NotFound = require('./not-found')
const DB = require('../lib/db')

router.get('/', function(req, res) {
	const config         = new DB.Config()
	config.fields      = 'link'
	config.fieldValues = [req.baseUrl.substring(1)]
	config.limit       = 1

	DB.fetchPosts(config)
		.then(function(data) {
			if (data.posts.length == 0) {
				NotFound.show(res)
				return
			}

			const post = data.posts[0]
			res.render('index', {
				posts: data.posts,
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
