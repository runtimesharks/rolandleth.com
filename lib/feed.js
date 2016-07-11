/**
 * Created by roland on 7/7/16.
 */

'use strict'

const RSS = require('rss')
const DB = require('../lib/db')
const Post = require('../models/post')
function Feed() {}

Feed.create = function() {
	return new Promise(function(resolve) {
		const config     = new DB.Config()
		config.limit   = -1

		DB.fetchPosts(config).then(function(data) {
			const feedOptions = {
				title: 'Roland Leth',
				description: 'Development thoughts by Roland Leth',
				feed_url: 'http://rolandleth.com/feed',
				site_url: 'http://rolandleth.com',
				managingEditor: 'Roland Leth',
				webMaster: 'Roland Leth',
				copyright: new Date().getFullYear() + ' Roland Leth',
				language: 'English',
				categories: ['iOS', 'Node.js', 'Ruby', 'development', 'web'],
				image: 'http://rolandleth.com/public/favicon.ico',
				pubDate: '',
				ttl: '5'
			}

			const feed = new RSS(feedOptions)
			data.posts.forEach(function(post, index) {
				if (index == 0) {
					feed.pubDate = Post.dateFromDateTime(post.datetime)
				}
				feed.item({
					title: post.title,
					description: post.body,
					url: 'http://rolandleth.com/' + post.link,
					date: Post.dateFromDateTime(post.datetime)
				})
			})

			resolve(feed.xml())
		})
	})
}

module.exports = Feed
