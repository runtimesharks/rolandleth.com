//
//  Post+Model.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Vapor
import VaporPostgreSQL

extension Post: Model {
	
	static func deleteFromDatabase(checking files: [Post]) {
		guard !files.isEmpty, let posts = try? Post.all() else { return }
		
		for post in posts {
			let exists = files.contains {
				post.link == $0.link && post.datetime == $0.datetime
			}
			guard !exists else { continue }
			
			try? post.delete()
		}
	}
	
	static func prepare(_ database: Database) throws {
		try database.create("posts") { posts in
			posts.id()
			posts.string("title", length: 9_999, optional: false, unique: false, default: nil)
			posts.string("body", length: 999_999, optional: false, unique: false, default: nil)
			posts.string("rawbody", length: 999_999, optional: false, unique: false, default: nil)
			posts.string("truncatedbody", length: 1200, optional: false, unique: false, default: nil)
			posts.string("datetime", length: 15, optional: false, unique: false, default: nil)
			posts.string("date", length: 12, optional: false, unique: false, default: nil)
			posts.string("modified", length: 15, optional: false, unique: false, default: nil)
			posts.string("link", length: 100, optional: false, unique: true, default: nil)
			posts.string("readingtime", length: 15, optional: false, unique: false, default: nil)
		}
	}
	
	static func revert(_ database: Database) throws {
		try database.delete("posts")
	}
	
	/// Tries to save the entity, and if it already exists, it updates its body.
	mutating func saveOrUpdate() {
		do {
			try save()
		}
		catch {
			if DatabaseError(error) == .alreadyExists {
				do {
					var p = try Post.query().filter("link", link).first()
					p?.rawBody = rawBody
					try p?.save()
				}
				catch let e {
					print(e)
				}
			}
		}
	}
	
}
