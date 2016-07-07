/**
 * Created by roland on 6/7/16.
 */

'use strict'

var router  = require('express').Router()
var Dropbox = require('../lib/dropbox')
var Post    = require('../models/post')
var DB       = require('../lib/db')
var readingTime = require('reading-time')
var marked = require('marked')

router.get('/' + process.env.MY_SYNC_KEY + '/:delete?', function(req, res) {
	Dropbox.getFolder('/Apps/Editorial/posts').then(function(folder) {
		var newPosts    = []
		var config      = new DB.Config()
		config.limit    = -1
		config.updating = true

		DB.fetchPosts(config).then(function(data) {
			folder.contents.forEach(function(item) {
				var matches  = item.path.match(/\/(apps)\/(editorial)\/(posts)\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\/\}\{\[\]_#&@$:"';,!=\?\+\*\-\)\(]+)\.md$/)
				var datetime = matches[4] + '-' + matches[5] + '-' + matches[6] + '-' + matches[7]
				var link     = matches[8]
				link         = link.replace(new RegExp(/([#,;!:"\'\.\?\[\]\{\}\(\$\/)]+)/, 'g'), '')
				link         = link.replace(new RegExp('&', 'g'), 'and')
				link         = link.replace(new RegExp(' ', 'g'), '-')
				link         = link.toLowerCase()

				var title    = ''
				var body     = ''
				var modified = item.client_mtime

				Dropbox.getFile(item.path).then(function(file) {
					var lines = file.toString().split('\n')
					title     = lines[0]
					lines.splice(0, 2)
					body = lines.join('\n')

					var time = function() {
						var t = readingTime(body)
						switch (true) {
							case t <= 0.2: return ''; break
							case t <= 0.5: return '25 sec read'; break
							case t <= 0.8: return '45 sec read'; break
							default: return t.text
						}
					}()

					newPosts.push(
						new Post(title, marked(body), time,
							datetime, modified, link)
					)

					if (newPosts.length != folder.contents.length)  { return }
					// We are at the last file

					newPosts.forEach(function(newPost, newPostIndex) {
						var finished = newPostIndex == newPosts.length - 1
						// Just the one(s) with the same link
						var posts = data.posts.filter(function(p) {
							return Post.linkMatch(newPost, p)
						})

						// Create
						if (posts.length == 0) {
							DB.createPost(newPost)
							if (finished) {
								finish(newPosts, data.posts, res, req.params.delete)
							}
							return
						}

						posts.forEach(function(post) {
							// Update
							if (newPost.datetime == post.datetime) {
								// Only if these differ, no reason to query the db for nothing
								if (newPost.modified != post.modified) {
									DB.updatePost(newPost)
								}
								return
							}

							var variant
							// Create a new one, with same link, but duplicated.
							// If it has --1 already, make it --2, and so on.
							if (post.link.slice(-3, -1) == '--') {
								variant = parseInt(post.link.slice(-1)[0])
							}
							else if (post.link.slice(-4, -2) == '--') {
								variant  = parseInt(post.link.slice(-2))
							}
							else {
								variant = 0
							}

							variant += 1
							newPost.link += '--' + variant

							DB.createPost(newPost)
						})

						if (!finished) { return }

						finish(newPosts, data.posts, res, req.params.delete)
					})
				}).catch(function(error) {
					console.log(error)
				})
			})
		}).catch(function(error) {
			console.log(error)
		})
	}).catch(function(error) {
		console.log(error)
	})
})

function finish(newPosts, posts, res, performDelete) {
	if (!performDelete) {
		res.redirect('/')
		return
	}

	posts.forEach(function(post, index) {
		var existingPosts = newPosts.filter(function(newPost) {
			return Post.linkMatch(newPost, post)
		})

		if (existingPosts.length) {
			if (index == posts.length - 1) {
				res.redirect('/')
			}
			return
		}

		DB.deletePost(post)

		if (index < posts.length - 1) { return }

		res.redirect('/')
	})
}

module.exports = router
