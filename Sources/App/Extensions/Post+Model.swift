//
//  Post+Model.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Vapor
import FluentProvider

extension Post: Model {
	
	func makeRow() throws -> Row {
		var row = Row()
		
		try row.set("title", title)
		try row.set("body", body)
		try row.set("rawbody", rawBody)
		try row.set("truncatedbody", truncatedBody)
		try row.set("datetime", datetime)
		try row.set("date", date)
		try row.set("modified", modified)
		try row.set("link", link)
		try row.set("readingtime", readingTime)
		
		return row
	}

	static func deleteFromDatabase(checking files: [File]) {
		guard !files.isEmpty, let posts = try? Post.all() else { return }
		
		for post in posts {
			let exists = files.contains {
				post.link == Post.link(from: $0.title, with: $0.datetime)
					&& post.datetime == $0.datetime
			}
			guard !exists else { continue }
			
			try? post.delete()
		}
	}
	
	/// Tries to save the entity, and if it already exists, it updates its body.
	func saveOrUpdate() {
		do {
			try save()
		}
		catch {
			if DatabaseError(error) == .alreadyExists {
				do {
					let p = try Post.makeQuery().filter("link", link).first()
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

extension Post: Preparation {
	
	static func prepare(_ database: Database) throws {
		try database.create(self) { posts in
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
		try database.delete(self)
	}
	
}
