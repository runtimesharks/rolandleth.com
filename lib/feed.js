/**
 * Created by roland on 7/7/16.
 */

"use strict"

const RSS  = require("rss")
const Db   = require("../lib/db")
const Post = require("../models/post")
function Feed() {}

Feed.create = function() {
	return Db.fetchFeedPosts().then(function(data) {
		const feedOptions = {
			title: "Roland Leth",
			description: "Development thoughts by Roland Leth",
			feed_url: "https://rolandleth.com/feed",
			site_url: "https://rolandleth.com",
			managingEditor: "Roland Leth",
			webMaster: "Roland Leth",
			copyright: new Date().getFullYear() + " Roland Leth",
			language: "English",
			categories: ["iOS", "Node.js", "Ruby", "development", "web"],
			image: "https://rolandleth.com/public/favicon.ico",
			pubDate: "",
			ttl: "5"
		}
		
		const feed = new RSS(feedOptions)
		data.posts.forEach(function(post, index) {
			if (index == 0) {
				feed.pubDate = Post.dateFromDateTime(post.datetime)
			}
			feed.item({
				title: post.title,
				description: post.body,
				url: "http://rolandleth.com/" + post.link,
				date: Post.dateFromDateTime(post.datetime)
			})
		})
		
		return feed.xml()
	})
}

module.exports = Feed
