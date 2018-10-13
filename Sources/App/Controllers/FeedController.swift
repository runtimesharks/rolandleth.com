//
//  FeedController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import Console
import HTTP

struct FeedController {
	
	private static func feed(micro: Bool, from request: Request) throws -> ResponseRepresentable {
		let posts: [Content]
		
		if micro {
			posts = try Micropost.makeQuery()
				.sort("datetime", .descending)
				.filteredPast()
				.all()
				.map(Content.init)
		}
		else {
			posts = try Post.makeQuery().sorted().all().map(Content.init)
		}
		
		guard !posts.isEmpty else { return Response.rootRedirect }
		
		request.setContentType(to: .xml)
		
		let feed = micro ? "microfeed" : "feed"
		let year = Calendar.current.component(.year, from: Date())
		let df = DateFormatter.shared.withIso8601Format()
		let updated = df.string(from: Date())
		var xml = ""
		
		xml += "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
		xml += "<feed xmlns=\"http://www.w3.org/2005/Atom\">\n"
		xml += "<title type=\"text\">Roland Leth</title>\n"
		xml += "<subtitle type=\"text\">Development thoughts by Roland Leth</subtitle>\n"
		xml += "<updated>\(updated)</updated>\n"
		xml += "<author>\n\t<name>Roland Leth</name>\n</author>\n"
		xml += "<link rel=\"self\" type=\"application/atom+xml\" href=\"\(request.domain)/\(feed)\"/>\n"
		xml += "<link rel=\"alternate\" type=\"text/html\" hreflang=\"en\" href=\"\(request.domain)\"/>\n"
		xml += "<id>\(request.domain)/feed</id>\n"
		xml += "<icon>\(request.domain)/images/favicons/192x192.png</icon>\n"
		xml += "<rights>Copyright (c) 2013–\(year), Roland Leth</rights>\n"
		
		func fullDate(from datetime: String) -> String? {
			df.withDatetimeFormat()
			guard let date = df.date(from: datetime) else { return nil }
			df.withIso8601Format()
			
			return df.string(from: date)
		}
		
		posts.forEach {
			let url = "\(request.domain)/\($0.link)"
			
			xml += "<entry>\n"
			xml += "\t<id>\(url)</id>\n"
			
			if let title = $0.title {
				xml += "\t<title>\(title)</title>\n"
			}
			
			xml += "\t<link rel=\"related\" type=\"text/html\" href=\"\(url)\"/>\n"
			xml += "\t<link rel=\"alternate\" type=\"text/html\" href=\"\(url)\"/>\n"
			
			if let date = fullDate(from: $0.datetime) {
				xml += "\t<published>\(date)</published>\n"
			}
			if let modified = $0.modified, let date = fullDate(from: modified) {
				xml += "\t<updated>\(date)</updated>\n"
			}
			
			xml += "\t<author>\n"
			xml += "\t\t<name>Roland Leth</name>\n"
			
			if micro {
				xml += "\t\t<uri>https://micro.blog/rolandleth</uri>\n"
			}
			else {
				xml += "\t\t<uri>\(request.domain)</uri>\n"
			}
			
			xml += "\t</author>\n"
			xml += "\t<content type=\"html\" xml:lang=\"en\"><![CDATA[\n"
			xml += $0.body
			//				.replacingOccurrences(of: "<mark>", with: "")
			//				.replacingOccurrences(of: "</mark>", with: "") + "\n"
			// Atom complains about the mark tag, and
			// this takes like 5-10ms for the whole loop ...
			xml += "]]></content>\n"
			xml += "</entry>\n"
		}
		
		xml += "</feed>"
		
		return xml
	}
	
	static func microfeed(with request: Request) throws -> ResponseRepresentable {
		return try feed(micro: true, from: request)
	}
	
	static func feed(with request: Request) throws -> ResponseRepresentable {
		return try feed(micro: false, from: request)
	}
	
}

private extension FeedController {
	
	struct Content {
		
		let title: String?
		let link: String
		let datetime: String
		let modified: String?
		let body: String
		
		
		// MARK: - Init

		init(from post: Post) {
			title = post.title
			link = post.link
			datetime = post.datetime
			modified = post.modified
			body = post.body
		}
		
		init(from micropost: Micropost) {
			title = nil
			link = micropost.link
			datetime = micropost.datetime
			modified = nil
			body = micropost.content
		}
		
	}
	
}
