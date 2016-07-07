/**
 * Created by roland on 7/7/16.
 */

'use strict';
var DB = require('../lib/db')

function SiteMap() {}

SiteMap.create = function() {
	return new Promise(function(resolve) {
		var noPriority = [
			'privacy-policy',
			'feed'
		]
		var lowPriority = [
			'projects/bouncyb',
			'projects/sosmorse',
			'projects/iwordjuggle',
			'projects/carminder'
		]
		var highPriority = [
			'about',
			'projects',
			'projects/expenses-planner'
		]

		var urls = noPriority.concat(lowPriority).concat(highPriority)

		var rootPath = 'http://rolandleth.com/'
		var xml       = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

		urls.forEach(function(url) {
			var priority = highPriority.includes(url) ? 0.9 :
			               lowPriority.includes(url) ? 0.3 : 0.1
			xml += '<url>'
			xml += '<loc>' + rootPath + url + '</loc>'
			xml += '<changefreq>' + 'yearly' + '</changefreq>'
			xml += '<priority>' + priority  + '</priority>'
			xml += '</url>'
		})

		var config     = new DB.Config()
		config.limit   = -1
		config.columns = ['link', 'modified', 'datetime']

		DB.fetchPosts(config).then(function(data) {
			data.posts.forEach(function(post) {
				xml += '<url>'
				xml += '<loc>' + rootPath + post.link + '</loc>'
				xml += '<changefreq>' + 'monthly' + '</changefreq>'
				xml += '<priority>' + 0.5 + '</priority>'
				xml += '<lastmod>' + post.modified + '</lastmod>'
				xml += '</url>'
			})

			xml += '</urlset>'
			resolve(xml)
		})
	})
}

module.exports = SiteMap
