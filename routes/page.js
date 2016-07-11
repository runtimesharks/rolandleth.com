/**
 * Created by roland on 1/7/16.
 */

'use strict'

var router = require('express').Router()
const NotFound = require('./not-found')
const DB = require('../lib/db')

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
	const  config = new DB.Config()
	config.offset = config.limit * (page - 1)

	DB.fetchPosts(config)
		.then(function(data) {
			if (config.offset > data.totalPosts) {
				NotFound.show(res)
				return
			}

			const htmlSave = require('htmlsave')

			data.posts.forEach(function(post) {
				if (post.body.length < 900) { return }
				post.body = htmlSave.truncate(post.body, 700, {
					breakword: false,
					ellipsis: ' [&hellip;]'
				})

				post.body += "<br/> \
					<a href='/" + post.link + "' \
						onClick = \"_gaq.push([ \
						'_trackEvent', \
						'continue-reading', \
						'click', \
						'/" + post.link + ">']);\"> \
						Continue reading &rarr;</a>"
			})

			res.render('index', {
				posts: data.posts,
				page: page,
				totalPosts: data.totalPosts,
				title: 'Roland Leth',
				metadata: 'Development thoughts by Roland Leth'
			})
		})
		.catch(function(error) {
			NotFound.show(res)
		})
}

module.exports = router
