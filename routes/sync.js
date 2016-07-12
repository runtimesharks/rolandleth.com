/**
 * Created by roland on 6/7/16.
 */

'use strict'

const router  = require('express').Router()
const Dropbox = require('../lib/dropbox')
const Post    = require('../models/post')
const DB       = require('../lib/db')
const readingTime = require('reading-time')
const marked = require('marked')

router.get('/' + process.env.MY_SYNC_KEY + '/:key1?/:key2?', function(req, res) {
	const shouldDelete = req.params.key1 == 'delete' || req.params.key2 == 'delete'
	const forced = req.params.key1 == 'force' || req.params.key2 == 'force'

	Dropbox.getFolder('/Apps/Editorial/posts').then(function(folder) {
		let newPosts    = []
		const config      = new DB.Config()
		config.limit    = 0
		config.updating = true

		DB.fetchPosts(config).then(function(data) {
			var posts = data.posts
			folder.contents.forEach(function(item) {
				const  matches  = item.path.match(/\/(apps)\/(editorial)\/(posts)\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\/\}\{\[\]_#&@$:"';,!=\?\+\*\-\)\(]+)\.md$/)
				const datetime = matches[4] + '-' + matches[5] + '-' + matches[6] + '-' + matches[7]
				let link     = matches[8]
				link         = link.replace(new RegExp(/([#,;!:"\'\.\?\[\]\{\}\(\$\/)]+)/, 'g'), '')
				link         = link.replace(new RegExp('&', 'g'), 'and')
				link         = link.replace(new RegExp(' ', 'g'), '-')
				link         = link.toLowerCase()

				let title    = ''
				let body     = ''
				let modified = item.client_mtime

				Dropbox.getFile(item.path).then(function(file) {
					let lines = file.toString().split('\n')
					title     = lines[0]
					lines.splice(0, 2)
					body = lines.join('\n')

					const time = function() {
						const t = readingTime(body)
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

					// First remove any posts corresponding to deleted files.
					if (shouldDelete) {
						// Iterate through existing posts, and if no corresponding
						// file is found, delete the post, and remove it from the data.
						data.posts.forEach(function(post, index) {
							let matchingNewPosts = newPosts.filter(function(newPost) {
								return Post.linksMatch(newPost, post) &&
								       newPost.datetime == post.datetime
							})

							if (matchingNewPosts.length) { return }

							DB.deletePost(post)
							posts.splice(index, 1)
						})
					}

					newPosts.forEach(function(newPost, newPostIndex) {
						let finished = newPostIndex == newPosts.length - 1

						// Just the one(s) with the same link
						let matchingPosts = posts.filter(function(p) {
							return Post.linksMatch(newPost, p)
						})

						// Create
						if (matchingPosts.length == 0) {
							DB.createPost(newPost)
							if (finished) {
								res.redirect('/')
							}
							return
						}

						matchingPosts.forEach(function(matchingPost) {
							// Update
							if (newPost.datetime == matchingPost.datetime) {
								// Only if these differ, no reason to query the db for nothing
								if (newPost.modified != matchingPost.modified || forced) {
									DB.updatePost(newPost)
								}
								return
							}

							let variant
							// Create a new one, with same link, but duplicated.
							// If it has --1 already, make it --2, and so on.
							if (matchingPost.link.slice(-3, -1) == '--') {
								variant = parseInt(matchingPost.link.slice(-1)[0])
							}
							else if (matchingPost.link.slice(-4, -2) == '--') {
								variant  = parseInt(matchingPost.link.slice(-2))
							}
							else {
								variant = 0
							}

							variant += 1
							newPost.link += '--' + variant

							DB.createPost(newPost)
						})

						if (!finished) { return }

						res.redirect('/')
					})
				})
			})
		}).catch(function(error) {
			console.log(error)
		})
	})
})

module.exports = router
