//
//  SearchController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Vapor
import HTTP
import VaporPostgreSQL

struct SearchController {
	
	static func perform(with request: Request) throws -> ResponseRepresentable {
		guard
			let query = request.query?.object?["q"]?.string,
			!query.trim().isEmpty
		else { return try JSON(node: ["results": []]) }
		
		return try JSON(node: "search raw")
	}
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		let page = (try? request.parameters.extract("page") as Int) ?? 1
		
		guard
			let query = request.query?.object?["query"]?.string,
			!query.trim().isEmpty,
//			let driver = drop.database?.driver as? PostgreSQLDriver,
//			case let sql = "SELECT * FROM posts WHERE title ILIKE '%\(query)%' OR body ILIKE '%\(query)%'",
//			let results = try? driver.raw(sql),
//			let posts = results.nodeArray?.flatMap({ try? Post(node: $0) }),
			case let sql = try Post.query().sorted().filtered(by: query),
			case let posts = try sql.paginated(to: page).run(),
			!posts.isEmpty
			else { return try NotFoundController.display(with: request) }
		
		let totalPosts = try sql.count()
		let params: [String: NodeRepresentable] = [
			"title": "Searching: \(query)",
			"metadata": "Search results.",
			"query": "?query=\(query)",
			"root": page == 2 ? "/search" : "/search/",
			"path": "/search",
			"page": page
		]
		
		return try drop.view.showResults(with: params,
		                                 for: request,
		                                 posts: posts,
		                                 totalPosts: totalPosts)
	}
	
}
