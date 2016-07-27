/**
 * Created by roland on 6/7/16.
 */

"use strict"

const Promise     = require("bluebird")
const router      = require("express").Router()
const Dropbox     = require("../lib/dropbox")
const Post        = require("../models/post")
const Db          = require("../lib/db")
const marked      = require("marked")

router.get("/create/" + process.env.MY_SYNC_KEY, function(req, res) {
	res.render("create-post", {
		title: "Create",
		metadata: "Create a post"
	})
})

router.post("/create/", function(req, res) {
	const body = req.body

	// Create the file first, if it doesn"t work, stay on the page.
	Dropbox.createFile(body).then(function(data) {
		if (!data) { res.end(); return }

		res.redirect("/cmd.sync/" + process.env.MY_SYNC_KEY)
	})
})

router.get("/" + process.env.MY_SYNC_KEY + "/:key1?/:key2?", function(req, res) {
	const shouldDelete = req.params.key1 == "delete" || req.params.key2 == "delete"
	const forced = req.params.key1 == "force" || req.params.key2 == "force"

	Promise.all([Db.fetchPostsForUpdating(), Dropbox.getFolder("/posts")]).then(function(data) {
		let posts = data[0].posts
		const folder = data[1]

		Promise.map(folder.contents, function(item) {
			return Promise.join(item, Dropbox.getFile(item.path), function(item, file) {
				return { item: item, file: file }
			})
		}).map(function(dropboxData) {
			const item = dropboxData.item
			const file = dropboxData.file

			const matches  = item.path.match(/\/(posts)\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\/\}\{\[\]_#&@$:"';,!=\?\+\*\-\)\(]+)\.md$/)
			const datetime = matches[2] + "-" + matches[3] + "-" + matches[4] + "-" + matches[5]
			let link       = Post.createLink(matches[6])

			let lines   = file.toString().split("\n")
			const title = lines[0]
			lines.splice(0, 2)
			const body = lines.join("\n")

			const modified = item.client_mtime

			return new Post(title, marked(body), Post.readingTime(body),
				datetime, modified, link)
		}).then(function(newPosts) {
			if (shouldDelete) {
				// Iterate through existing posts, and if no corresponding
				// file is found, delete the post, and remove it from the data.
				data[0].posts.forEach(function(post, index) {
					let matchingNewPosts = newPosts.filter(function(newPost) {
						return Post.linksMatch(newPost, post) &&
						       newPost.datetime == post.datetime
					})

					if (matchingNewPosts.length) { return }

					Db.deletePost(post)
					posts.splice(index, 1)
				})
			}

			Promise.map(newPosts, function(newPost) {
				// Just the one(s) with the same link
				let matchingPosts = posts.filter(function(p) {
					return Post.linksMatch(newPost, p)
				})

				let returnObject = {
					newPost: newPost,
					matchingPosts: matchingPosts
				}

				// Create
				if (matchingPosts.length == 0) {
					Db.createPost(newPost)
				}

				return returnObject
			}).each(function(data) {
				const newPost = data.newPost
				const matchingPosts = data.matchingPosts

				matchingPosts.forEach(function(matchingPost) {
					// Update
					if (newPost.datetime == matchingPost.datetime) {
						// Only if these differ, no reason to query the db for nothing
						if (newPost.modified != matchingPost.modified || forced) {
							Db.updatePost(newPost)
						}
						return
					}

					let variant
					// Create a new one, with same link, but duplicated.
					// If it has --1 already, make it --2, and so on.
					if (matchingPost.link.slice(-3, -1) == "--") {
						variant = parseInt(matchingPost.link.slice(-1)[0])
					}
					else if (matchingPost.link.slice(-4, -2) == "--") {
						variant  = parseInt(matchingPost.link.slice(-2))
					}
					else {
						variant = 0
					}

					variant += 1
					newPost.link += "--" + variant

					Db.createPost(newPost)
				})
			}).then(function() {
				res.redirect("/")
			})
		})
	}).catch(function(error) {
		console.log(error)
	})
})

module.exports = router
