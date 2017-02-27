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
	
	init(node: Node, in context: Context) throws {
		id = try node.extract("id")
		title = try node.extract("title")
		body = try node.extract("body")
		rawBody = try node.extract("rawbody")
		datetime = try node.extract("datetime")
		modified = try node.extract("modified")
		link = try node.extract("link")
		truncatedBody = try node.extract("truncatedbody")
		readingTime = try node.extract("readingtime")
		date = try node.extract("date")
	}
	
	static func prepare(_ database: Database) throws {
		try database.create("posts") { posts in
			posts.id()
			posts.string("title", length: 9_999, optional: false, unique: false, default: nil)
			posts.string("body", length: 999_999, optional: false, unique: false, default: nil)
			posts.string("rawBody", length: 999_999, optional: false, unique: false, default: nil)
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
					p?.body = body
					try p?.save()
				}
				catch let e {
					print(e)
				}
			}
		}
	}
	
}
