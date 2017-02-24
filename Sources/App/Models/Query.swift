//
//  Query.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation
import Fluent

extension Query {
	
	func sorted(past: Bool = false) throws -> Query<T> {
		let q = try self
			.sort("datetime", .descending)
			.sort("title", .ascending)
		
		if past { return q }
		
		return try q.filteredPast()
	}
	
	func filtered(by query: String) throws -> Query<T> {
		return try or {
			try $0.filter("title", .contains(sensitive: false), query)
			try $0.filter("body", .contains(sensitive: false), query)
		}
	}
	
	func paginated(to page: Int) throws -> Query<T> {
		return try limit(Post.postsPerPage, withOffset: Post.postsPerPage * (page - 1))
	}
	
	func filteredPast() throws -> Query<T> {
		return try filter("datetime", .lessThanOrEquals, Post.datetime(from: Date()) ?? "")
	}
	
}
