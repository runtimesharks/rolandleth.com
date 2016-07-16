/**
 * Created by roland on 1/7/16.
 */

'use strict'

const router   = require('express').Router()
const NotFound = require('./not-found')
const Db       = require('../lib/db')
const DbConfig = require('../models/dbConfig')
const Post     = require('../models/post')

router.get('/', function(req, res) {
	if (req.baseUrl == '/1') {
		res.redirect('/')
		res.end()
	}
	else {
		var page = req.baseUrl.substring(1) || 1
		fetchPage(page, res)
	}
})

function fetchPage(page, res) {
	const config = DbConfig.page(page)

	Db.fetchPosts(config).then(function(data) {
		if (config.offset > data.totalPosts) {
			NotFound.show(res)
			return
		}

		data.posts.forEach(function(post) {
			post.body = Post.truncatedBody(post)
		})

		res.render('index', {
			posts: data.posts,
			page: page,
			totalPosts: data.totalPosts,
			title: 'Roland Leth',
			metadata: 'Development thoughts by Roland Leth'
		})
	}).catch(function() {
		NotFound.show(res)
	})
}

module.exports = router