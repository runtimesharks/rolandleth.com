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
			!query.trim().isEmpty
		else { return try JSON(node: ["results": []]) }
		
		return try JSON(node: "search raw")
	}
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		let page = (try? request.parameters.extract("page") as Int) ?? 1
		
		guard
			let query = request.query?.object?["query"]?.string,
			!query.trim().isEmpty,
			// Fluent doesn't support case insensitive queries, yet :(
			let driver = drop.database?.driver as? PostgreSQLDriver,
			let datetime = Post.datetime(from: Date()),
			case var sql = "SELECT * FROM posts WHERE ",
			case _ = sql += "(title ILIKE '%\(query)%' OR rawbody ILIKE '%\(query)%') AND ",
			case _ = sql += "datetime <= '\(datetime)' ",
			case _ = sql += "ORDER BY datetime DESC, title ASC ",
			case let limitedSql = "\(sql) LIMIT \(drop.postsPerPage) OFFSET \(drop.postsPerPage * (page - 1))",
			let allResults = try? driver.raw(sql),
			let totalPosts = allResults.array?.count,
			let results = try? driver.raw(limitedSql),
			var posts = results.nodeArray?.flatMap({ try? Post(node: $0) }),
//			case let sql = try Post.query().sorted().filtered(by: query),
//			case let posts = try sql.paginated(to: page).run(),
			!posts.isEmpty
			else { return try NotFoundController.display(with: request) }
		
		try posts.enumerated().forEach { i, _ in
			try posts[i].truncatedBody.addSearchMarkTags(around: query)
		}
		
//		let totalPosts = try sql.count()
		let params: [String: NodeRepresentable] = [
			"title": "Searching: \(query)",
			"metadata": "Search results.",
			"query": "?query=\(query.addingPercentEncoding(withAllowedCharacters: .letters)!)",
			"root": "/search/",
			"page": page
		]
		
		return try drop.view.showResults(with: params,
		                                 for: request,
		                                 posts: posts,
		                                 totalPosts: totalPosts)
	}
	
}

fileprivate extension String {
	
	mutating func addSearchMarkTags(around string: String) throws {
		// Wrap the value between a mark of class 'search', to style it
		let addRegex = try NSRegularExpression(pattern: string,
		                                       options: .caseInsensitive)
		// And remove the occurrences of the search marks on that line,
		// otherwise links and images will break
		let markOpen = "<mark class=\"search\">"
		let markClose = "</mark>"
		let markPattern = "<([^>]*?)\(markOpen)(.+?)\(markClose)(.*?)>"
		let removeRegex = try NSRegularExpression(pattern: markPattern,
		                                          options: .caseInsensitive)
		
		self = addRegex.stringByReplacingMatches(in: self, options: [], range: nsRange,
			withTemplate: "\(markOpen)$0\(markClose)")
		
		removeRegex
			.matches(in: self, options: [], range: nsRange)
			.map { $0.range }
			.reversed()
			.forEach {
				self = replacingOccurrences(of: markOpen, with: "", range: range(from: $0))
				self = replacingOccurrences(of: markClose, with: "", range: range(from: $0))
		}
	}
	
}
