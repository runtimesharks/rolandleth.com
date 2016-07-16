/**
 * Created by roland on 6/7/16.
 */

'use strict'

const router   = require('express').Router()
const NotFound = require('./not-found')
const Db       = require('../lib/db')
const Post     = require('../models/post')

router.get('/', function(req, res) {
	// Regex to match all words between quotes as a single param,
	// and the words outside quotes as individual params.
//	req.query.query
//		.match(/\"(.*?)\"|(\w+)/g)
//		.map(function(match) {
//			return match.replace(/"/g, '')
//		})

	Db.searchPosts(req.query.query).then(function(data) {
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