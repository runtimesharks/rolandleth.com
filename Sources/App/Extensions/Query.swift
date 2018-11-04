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
	
	func sorted(future: Bool = false) throws -> Query {
		let q = try self
			.sort("datetime", .descending)
			.sort("title", .ascending)
		
		if future { return q }
		
		return try q.filteredPast()
	}
	
	func filtered(by query: String) throws -> Query {
		return try self.or {
			try $0.filter(raw: "title ILIKE '%\(query)%'")
			try $0.filter(raw: "rawbody ILIKE '%\(query)%'")
		}
	}
	
	func paginated(to page: Int) throws -> Query {
		return try limit(drop.postsPerPage, offset: drop.postsPerPage * (page - 1))
	}
	
	func filteredPast() throws -> Query {
		return try self.and {
			try $0.filter("datetime", .lessThanOrEquals, Post.datetime(from: Date()))
			try $0.filter("accessibleonlybylink", false)
		}
	}
	
}
