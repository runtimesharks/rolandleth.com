/**
 * Created by roland on 1/7/16.
 */

'use strict'

const ejs = require('ejs')
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

		const pages = Math.ceil(data.totalPosts / (parseInt(process.env.PAGE_SIZE) || 10))

		if (pages > 1) {
			const path = './views/partials/page-navigation.ejs'
			const options = { page: parseInt(page), pages: pages }

			ejs.renderFile(path, options, function(err, str) {
				render(res, data.posts, str)
			})
		}
		else {
			render(res, data.posts)
		}
	}).catch(function() {
		NotFound.show(res)
	})
}

function render(res, posts, pageNavigation = '') {
	res.render('index', {
		posts: posts,
		title: 'Roland Leth',
		metadata: 'Development thoughts by Roland Leth',
		pageNavigation: pageNavigation
	})
}

module.exports = router
