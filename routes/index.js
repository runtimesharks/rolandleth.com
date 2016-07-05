/**
 * Created by roland on 1/7/16.
 */

var router = require('express').Router()

router.get('/', function(req, res, next) {
	fetchPage(1, res)
})

// Pages
router.get(/^\/(\d+)$/, function(req, res) {
	if (req.path == '/1') {
		res.redirect('/')
		res.stop()
	}
	else {
		var page = req.path.substring(1) || 1
		fetchPage(page, res)
	}
})

// Articles
router.get(/^\/([\w\d\-]+)$/, function(req, res) {
	fetchPosts('link', req.path.substring(1))
		.then(function(data) {
			if (data.length == 0) {
				show404(res)
			}

			var post = data.slice(0, 1)
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

function fetchPosts(where, value, orderBy, direction) {
	return new Promise(function(resolve, reject) {
		var DB = require('../lib/db')
		var db = new DB()

		db.fetchPosts(where, value, orderBy, direction)
			.then(function(data) {
				resolve(data)
			})
			.catch(function(error) {
				reject(error)
			})
	})
}

function fetchPage(page, res) {
	var pageSize = process.env.PAGE_SIZE || 10
	var start    = pageSize * (page - 1)

	fetchPosts()
		.then(function(data) {
			if (start > data.length) {
				show404(res)
			}

			res.render('index.ejs', {
				posts: data.slice(start, start + pageSize),
				page: page,
				totalPosts: data.length,
				title: 'Roland Leth',
				metadata: 'Development thoughts by Roland Leth'
			})
		})
		.catch(function() {
			show404(res)
		})
}

function show404(res) {
	res.render('not-found', {
		title: '404',
		metadata: 'Development thoughts by Roland Leth'
	})
	res.stop()
}

module.exports = router