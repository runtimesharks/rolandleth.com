/**
 * Created by roland on 7/7/16.
 */

'use strict'

const Db = require('../lib/db')

function SiteMap() {}

SiteMap.create = function() {
	return new Promise(function(resolve) {
		const noPriority = [
			'privacy-policy',
			'feed'
		]
		const lowPriority = [
			'projects/bouncyb',
			'projects/sosmorse',
			'projects/iwordjuggle',
			'projects/carminder'
		]
		const highPriority = [
			'about',
			'projects',
			'projects/expenses-planner'
		]

		const urls = noPriority.concat(lowPriority).concat(highPriority)

		const rootPath = 'http://rolandleth.com/'
		let xml       = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

		urls.forEach(function(url) {
			const priority = highPriority.includes(url) ? 0.9 :
			               lowPriority.includes(url) ? 0.3 : 0.1
			xml += '<url>'
			xml += '<loc>' + rootPath + url + '</loc>'
			xml += '<changefreq>' + 'yearly' + '</changefreq>'
			xml += '<priority>' + priority  + '</priority>'
			xml += '</url>'
		})

		Db.fetchSiteMapPosts().then(function(data) {
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
