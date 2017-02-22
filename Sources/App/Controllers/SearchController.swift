//
//  SearchController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct SearchController {
	
	static func perform(with request: Request) throws -> ResponseRepresentable {
		guard
			let query = request.query?.object?["q"]?.string,
			!query.trim().isEmpty,
//			let driver = C.drop.database?.driver as? PostgreSQLDriver,
//			case let sql = "SELECT * FROM posts WHERE title ILIKE '%\(query)%' OR body ILIKE '%\(query)%'",
//			let results = try? driver.raw(sql),
//			let posts = results.nodeArray?.flatMap({ try? Post(node: $0) }),
			let posts = try? Post.query().group(.or, {
				try $0.filter("title", .contains(sensitive: false), query)
				try $0.filter("body", .contains(sensitive: false), query)
			}).run(),
			!posts.isEmpty
			else { return try NotFoundController.display(with: request) }
		
		print("search: \(query), posts: \(posts.count)")
		
		return try JSON(node: posts)
	}
	
}
