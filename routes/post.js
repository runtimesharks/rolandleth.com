/**
 * Created by roland on 6/7/16.
 */

'use strict'

const router   = require('express').Router()
const NotFound = require('./not-found')
const Db = require('../lib/db')

router.get('/', function(req, res) {
	Db.fetchPost(req.baseUrl.substring(1)).then(function(data) {
		if (data.posts.length == 0) {
			NotFound.show(res)
			return
		}

		const post = data.posts[0]
		res.render('index', {
			posts: data.posts,
			title: post.title,
			metadata: post.title,
			pageNavigation: ''
		})
	}).catch(function() {
		NotFound.show(res)
	})
})

module.exports = router
