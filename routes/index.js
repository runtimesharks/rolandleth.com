/**
 * Created by roland on 1/7/16.
 */

var router = require('express').Router()
var DBConfig = require('../lib/dbConfig')

router.get('/', function(req, res) {
	fetchPage(1, res)
})

// Search
router.get('/search', function(req, res) {
	console.log(req.query)
	var config         = new DBConfig()
	config.fields      = ['body', 'title']
	config.searching   = true
	config.fieldValues = req.query.query
		.match(/\"(.*?)\"|(\w+)/g)
		.map(function(match) {
			return match.replace(/"/g, '')
		})

	fetchPosts(config)
		.then(function(data) {
			if (data.posts.length == 0) {
				show404(res, true)
				return
			}

			res.render('index', {
				posts: data.posts,
				title: 'Search results',
				page: 1,
				totalPosts: data.totalPosts,
				metadata: 'Search results'
			})
		})
		.catch(function() {
			show404(res)
		})
})

// Pages
router.get(/^\/(\d+)$/, function(req, res) {
	if (req.path == '/1') {
		res.redirect('/')
		res.end()
	}
	else {
		var page = req.path.substring(1) || 1
		fetchPage(page, res)
	}
})

// Articles
router.get(/^\/([\w\d\-]+)$/, function(req, res) {
	var config         = new DBConfig()
	config.fields      = 'link'
	config.fieldValues = req.path.substring(1)
	config.limit       = 1

	fetchPosts(config)
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

function fetchPosts(config) {
	return new Promise(function(resolve, reject) {
		var DB = require('../lib/db')
		var db = new DB()

		db.fetchPosts(config)
			.then(function(data) {
				resolve(data)
			})
			.catch(function(error) {
				reject(error)
			})
	})
}

function fetchPage(page, res) {
	var config = new DBConfig()
	config.offset = config.pageSize * (page - 1)

	fetchPosts(config)
		.then(function(data) {
			if (config.offset > data.posts.length) {
				show404(res)
				return
			}

			var htmlSave = require('htmlsave')

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
		.catch(function() {
			show404(res)
		})
}

function show404(res, search) {
	res.render('not-found' + (search ? '-search' : ''), {
		title: '404',
		metadata: 'Development thoughts by Roland Leth'
	})
	res.end()
}

module.exports = router