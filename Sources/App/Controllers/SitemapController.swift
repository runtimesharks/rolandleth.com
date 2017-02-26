//
//  SitemapController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct SitemapController {

	static func create(with request: Request) throws -> ResponseRepresentable {
		request.setContentType(to: .xml)

		let noPriority = [
			"privacy-policy",
			"feed"
		]
		let lowPriority = [
			"projects/bouncyb",
			"projects/sosmorse",
			"projects/iwordjuggle",
			"projects/carminder"
		]
		let highPriority = [
			"about",
			"projects",
			"projects/expenses-planner"
		]

		let posts = try Post.query().sorted(future: true).run()
		let urls = noPriority + lowPriority + highPriority
		let root = "https://rolandleth.com/"
		var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"
		
		urls.forEach {
			let priority = highPriority.contains($0) ? 0.9 : (lowPriority.contains($0) ? 0.3 : 0.1)
			xml += "<url>"
			xml += "<loc>\(root)\($0)</loc>"
			xml += "<changefreq>yearly</changefreq>"
			xml += "<priority>\(priority)</priority>"
			xml += "</url>"
		}
		
		posts.forEach {
			xml += "<url>"
			xml += "<loc>\(root)\($0.link)</loc>"
			xml += "<changefreq>monthly</changefreq>"
			xml += "<priority>0.5</priority>"
			xml += "<lastmod>\($0.modified)</lastmod>"
			xml += "</url>"
		}
		
		xml += "</urlset>"

		return xml
	}

}
