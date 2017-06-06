//
//  SyncController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor

struct SyncController {
	
	static func perform(with request: Request) throws -> ResponseRepresentable {
		let key = try request.parameters.next(String.self)
		
		guard key == drop.syncKey else { return Response.rootRedirect }
		
		let command = (try? request.parameters.next(String.self)) ?? ""
		
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
		try Post.save(from: file)
		
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
		guard drop.production else {
			return try LocalStore.perform(withDelete: performDelete, for: path)
		}
		
		return try CloudStore.perform(withDelete: performDelete, for: path)
	}
	
	private static func createFile(with request: Request) throws -> File {
		guard drop.production else {
			return try LocalStore.createFile(from: request.body.bytes)
		}
		
		return try CloudStore.createFile(from: request.body.bytes)
	}
	
}
