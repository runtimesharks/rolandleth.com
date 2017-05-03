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
		var xml = ""
		
		xml += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
		xml += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"
		
		func priority(for url: String) -> Float {
			if highPriority.contains(url) {
				return 0.9
			}
			
			if lowPriority.contains(url) {
				return 0.3
			}
			
			return 0.1
		}
		
		urls.forEach {
			xml += "<url>"
			xml += "<loc>\(root)\($0)</loc>"
			xml += "<changefreq>yearly</changefreq>"
			xml += "<priority>\(priority(for: $0))</priority>"
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
