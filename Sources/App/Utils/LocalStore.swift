//
//  LocalStore.swift
//  roland
//
//  Created by Roland Leth on 01.03.2017.
//
//

import Foundation

struct LocalStore {
	
	private static var folderPath: String {
		let path: String
		
		if let postsPath = drop.config["server", "postsPath"]?.string {
			path = postsPath
		}
		else {
			path = "/Users/roland/Documents/"
		}
		
		return path + "blog/posts/"
	}
	
	/// Reads all local files, or the one that matches the `path` passed, and saves them to the database.
	///
	/// - Note: It returns an array of dictionaries, because if a file throws an error, we don't want to stop the whole process, but we do want to know which one failed and why.
	///
	/// - Parameters:
	///   - performDelete: A flag which determines whether posts that exist in the database, but on as a file should be deleted or not.
	///   - path: The path of an individual post to be synced.
	/// - Returns: A dictionary of errors, if any occurred.
	/// - Throws: Any errors its underlying methods will throw.
	static func perform(withDelete performDelete: Bool, for path: String) throws -> [String: String] {
		// Dash, so all paths contain it, in case we don't want
		// to perform for a specific post - the one we just created, for example.
		// (I'm using Hazel and a script for auto-syncing)
		let path = path.isEmpty ? "-" : path.droppingFirst()
		var errors: [String: String] = [:]
		var files: [File] = []
		
		try postsFolder().filter { $0.contains(path) }.forEach {
			do {
				let file = try self.file(from: $0)
				files.append(file)
			}
			catch {
				errors[$0] = "\(error)"
			}
		}
		
		// First delete the ones that don't exist, then create new ones,
		// because if a rename happened, it will first create a duplicate --X variation.
		if performDelete {
			Post.deleteFromDatabase(checking: files)
		}
		
		try files.forEach(Post.save)
		
		return errors
	}
	
	static func createFile(from bytes: [UInt8]?) throws -> File {
		let file = try File(from: bytes)
		
		guard
			FileManager.default.createFile(
				atPath: folderPath + "\(file.path)",
				contents: file.contentsData)
		else { throw "Couldn't create file at \(file.path)" }
		
		return file
	}
	
	private static func postsFolder() throws -> [String] {
		do {
			let paths = try FileManager.default.contentsOfDirectory(atPath: folderPath)
			return paths.filter { $0.hasSuffix(".md") }
		}
		catch let error as NSError {
			throw error.localizedDescription
		}
	}
	
	private static func file(from path: String) throws -> File {
		guard
			let data = FileManager.default.contents(atPath: "\(folderPath)\(path)"),
			let contents = String(data: data, encoding: .utf8)
		else { throw "Can't read contents." }
		
		return try File(path: path, contents: contents)
	}
	
}
