/**
 * Created by roland on 6/7/16.
 */

'use strict'

const router = require('express').Router()
const NotFound = require('./not-found')
const DB = require('../lib/db')
const Post = require('../models/post')

router.get('/', function(req, res) {
	const config         = new DB.Config()
	config.searching   = true
	config.limit       = 0
	config.fields      = ['body', 'title']
	config.fieldValues = [req.query.query]
//		.match(/\"(.*?)\"|(\w+)/g)
//		.map(function(match) {
//			return match.replace(/"/g, '')
//		})

	DB.fetchPosts(config).then(function(data) {
		if (data.posts.length == 0) {
			NotFound.show(res, true)
			return
		}

		data.posts.forEach(function(post) {
			post.body = Post.truncatedBody(post)
		})

		res.render('partials/search', {
			posts: data.posts,
			title: 'Search results',
			page: 1,
			totalPosts: data.totalPosts,
			metadata: 'Search results'
		})
	}).catch(function() {
		NotFound.show(res)
	})
})

module.exports = router
