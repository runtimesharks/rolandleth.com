//
//  SyncController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP

struct SyncController {
	
	static func perform(with request: Request, key: String, command: String = "") throws -> ResponseRepresentable {
		guard key == drop.syncKey else { return Response.rootRedirect }
		
		let delete: Bool
		switch command {
		case "delete": delete = true
		case "create": return try drop.view.make("create-post", with: [:], for: request)
		default: delete = false
		}
		
		// When we perform a sync with delete, we can't really want
		// to perform for a single post, but for all.
		// That means when we do have a command which is not delete, it's a path.
		let path = delete ? "" : command.replacingOccurrences(of: "%20", with: " ")
		let possibleErrors = try perform(withDelete: delete, path: path)
		
		guard
			possibleErrors.isEmpty
				|| (possibleErrors["success"] as? Bool == true && possibleErrors.count == 1)
		else { return try JSON(possibleErrors) }
		
		return Response.rootRedirect
	}
	
	static func create(with request: Request) throws -> ResponseRepresentable {
		let file = try createFile(with: request)
		try createPost(with: file)
		return Response.rootRedirect
	}
	
	/// Performs the sync on the local or cloud store. 
	///
	/// - Note: It returns an array of dictionaries, because if a file throws an error, we don't want to stop the whole process, but we do want to know which one failed and why.
	///
	/// - Parameters:
	///   - performDelete: A flag which determines whether posts that exist in the database, but on as a file should be deleted or not.
	///   - path: The path of an individual post to be synced.
	/// - Returns: A dictionary of errors, if any occurred.
	/// - Throws: Any errors its underlying methods will throw.
	private static func perform(withDelete performDelete: Bool, path: String) throws -> [String: Any] {
		if drop.production {
			return try CloudStore.perform(withDelete: performDelete, for: path)
		}
		return try LocalStore.perform(withDelete: performDelete, for: path)
	}
	
	private static func createFile(with request: Request) throws -> File {
		if drop.production {
			return try CloudStore.createFile(from: request.body.bytes)
		}
		else {
			return try LocalStore.createFile(from: request.body.bytes)
		}
	}
	
	private static func createPost(with file: File) throws {
		var post = Post(from: file)
		post.saveOrUpdate()
	}
	
}
