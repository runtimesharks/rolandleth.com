/**
 * Created by roland on 1/7/16.
 */

"use strict"

const router   = require("express").Router()
const NotFound = require("./not-found")
const Db       = require("../lib/db")
const DbConfig = require("../models/dbConfig")

router.get("/", function(req, res) {
	if (req.baseUrl == "/1") {
		res.redirect("/")
		res.end()
	}
	else {
		const page = req.baseUrl.substring(1) || 1
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
			post.body = post.truncatedBody
		})

		const pages = Math.ceil(data.totalPosts / (parseInt(process.env.PAGE_SIZE) || 10))

		if (pages > 1) {
			const path = "./views/partials/page-navigation.ejs"
			const options = { page: parseInt(page), pages: pages }
			const ejs = require("ejs")
			
			ejs.renderFile(path, options, function(err, str) {
				render(res, data.posts, page, str)
			})
		}
		else {
			render(res, data.posts, page)
		}
	}).catch(function() {
		NotFound.show(res)
	})
}

function render(res, posts, page, pageNavigation) {
	res.render("index", {
		posts: posts,
		title: "Roland Leth",
		metadata: "Development thoughts by Roland Leth",
		page: page,
		pageNavigation: pageNavigation
	})
}

module.exports = router
