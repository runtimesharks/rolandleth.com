//
//  FeedController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct FeedController {
	
	static func create(with request: Request) throws -> ResponseRepresentable {
		let posts = try Post.query().sorted().run()
		
		guard !posts.isEmpty else { return Response.rootRedirect }
		
		request.setContentType(to: .xml)
		
		let year = Calendar.current.component(.year, from: Date())
		let fullFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
		let df = DateFormatter.shared
		df.dateFormat = fullFormat
		let updated = df.string(from: Date())
		var xml = ""
		
		xml += "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
		xml += "<feed xmlns=\"http://www.w3.org/2005/Atom\">\n"
		xml += "<title type=\"text\">Roland Leth</title>\n"
		xml += "<subtitle type=\"text\">Development thoughts by Roland Leth</subtitle>\n"
		xml += "<updated>\(updated)</updated>\n"
		xml += "<author>\n\t<name>Roland Leth</name>\n</author>\n"
		xml += "<link rel=\"self\" type=\"application/atom+xml\" href=\"\(request.domain)/feed\"/>\n"
		xml += "<link rel=\"alternate\" type=\"text/html\" hreflang=\"en\" href=\"\(request.domain)\"/>\n"
		xml += "<id>\(request.domain)/feed</id>\n"
		xml += "<icon>\(request.domain)/images/favicons/192x192.png</icon>\n"
		xml += "<rights>Copyright (c) \(year), Roland Leth</rights>\n"
		
		func fullDate(from datetime: String) -> String? {
			df.setDatetimeFormat()
			guard let date = df.date(from: datetime) else { return nil }
			df.dateFormat = fullFormat
			
			return df.string(from: date)
		}
		
		posts.forEach {
			let url = "\(request.domain)/\($0.link)"
			
			xml += "<entry>\n"
			xml += "\t<id>\(url)</id>\n"
			xml += "\t<title>\($0.title)</title>\n"
			xml += "\t<link rel=\"related\" type=\"text/html\" href=\"\(url)\"/>\n"
			xml += "\t<link rel=\"alternate\" type=\"text/html\" href=\"\(url)\"/>\n"
			
			if let date = fullDate(from: $0.datetime) {
				xml += "\t<published>\(date)</published>\n"
			}
			if let date = fullDate(from: $0.modified) {
				xml += "\t<updated>\(date)</updated>\n"
			}
			
			xml += "\t<author>\n"
			xml += "\t\t<name>Roland Leth</name>\n"
			xml += "\t\t<uri>\(request.domain)</uri>\n"
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
	
}
