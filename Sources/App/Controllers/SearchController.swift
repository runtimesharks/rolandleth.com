//
//  SearchController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor

struct SearchController {
	
	static func perform(with request: Request) throws -> ResponseRepresentable {
		guard
			let query = request.query?.object?["q"]?.string,
			!query.trim().isEmpty
		else { return try JSON(node: ["results": []]) }
		
		return try JSON(node: "search raw")
	}
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		let page = request.parameters["page"]?.int ?? 1
		
		guard
			let query = request.query?.object?["query"]?.string,
			!query.trim().isEmpty,
			case let sql = try Post.makeQuery()
				.sorted()
				.filtered(by: query)
				.filteredPast(),
			case let posts = try sql
				.paginated(to: page)
				.all(),
			!posts.isEmpty
		else { throw Abort.notFound }
		
		try posts.enumerated().forEach { i, _ in
			try posts[i].truncatedBody.addSearchMarkTags(around: query)
		}
		
		let totalPosts = try sql.count()
		let params: [String: Any] = [
			"title": "Searching: \(query)",
			"metadata": "Search results.",
			"query": "?query=\(query.addingPercentEncoding(withAllowedCharacters: .letters)!)",
			"root": "/search/",
			"page": page,
			"isSearch": true
		]
		
		return try drop.view.showResults(with: params,
		                                 for: request,
		                                 posts: posts,
		                                 totalPosts: totalPosts)
	}
	
}

private extension String {
	
	mutating func addSearchMarkTags(around term: String) throws {
		let markOpen = "<mark class=\"search\">"
		let markClose = "</mark>"
		let markPattern = "<([^>]*?)\(markOpen)(.+?)\(markClose)(.*?)>"
		
		func wrap(_ string: String) -> String {
			return "\(markOpen)\(string)\(markClose)"
		}
		
		let wrapLength = wrap(term).length - term.length
		
		// Wrap the value between a mark of class 'search', to style it.
		// Since search queries can contain regex operators, we can't use those.
		var remainingRange: Range<String.Index> = range(from: nsRange)
		
		while true {
			guard
				let termRange = range(of: term, options: .caseInsensitive,
				                      range: remainingRange)
			else { break }
			
			// Save the original occurence.
			#if os(Linux)
				let original = String(self[termRange])!
			#else
				let original = String(self[termRange])
			#endif
			
			// Use the original occurence, which has the proper case.
			replaceSubrange(termRange, with: wrap(original))
			
			// The new start index will be at the end of our term range,
			// offset by the difference in length between the term and the tags.
			let newStartIndex = index(termRange.upperBound, offsetBy: wrapLength)
			
			// Be sure the new start index is still within bounds.
			guard newStartIndex < endIndex else { break }
			
			remainingRange = newStartIndex..<endIndex
		}
		
		// And remove the occurrences of the search marks on that line,
		// otherwise links and images will break
		let removeRegex = try NSRegularExpression(pattern: markPattern,
		                                          options: .caseInsensitive)
		
		let matchRanges = removeRegex
			.matches(in: self, options: [], range: nsRange)
			.map { $0.range }
			.reversed()
			
		for match in matchRanges {
				// We're already removing in reverse, but we also need to remove the closing tags first.
				self = replacingOccurrences(of: markClose, with: "", range: range(from: match))
				self = replacingOccurrences(of: markOpen, with: "", range: range(from: match))
		}
	}
	
}
