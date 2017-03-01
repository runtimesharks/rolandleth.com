//
//  LocalStore.swift
//  roland
//
//  Created by Roland Leth on 01.03.2017.
//
//

import Foundation

struct LocalStore {
	
	private static let postsFolderPath = "/Users/roland/Desktop/blog/posts"
	
	/// Reads all local files, or the one that matches the `path` passed, and saves them to the database.
	///
	/// - Parameters:
	///   - performDelete: A flag which determines whether posts that exist in the database, but on as a file should be deleted or not.
	///   - path: The path of an individual post to be synced.
	/// - Returns: Returns a dictionary of errors, if any occurred.
	/// - Throws: Throws any errors its underlying methods will throw.
	static func perform(withDelete performDelete: Bool, for path: String) throws -> [String: String] {
		// Dash, so all paths contain it, in case we don't want
		// to perform for a specific post, usually the one we just created.
		// (I'm using Hazel and a script for auto-syncing)
		let path = path.isEmpty ? "-" : path.droppingFirst()
		var errors: [String: String] = [:]
		var files: [Post] = []
		
		try postsFolder().filter { $0.contains(path) }.forEach {
			do {
				var post = try self.post(from: $0)
				post.saveOrUpdate()
				files.append(post)
			}
			catch {
				errors[$0] = "\(error)"
			}
		}
		
		if performDelete {
			Post.deleteFromDatabase(checking: files)
		}
		
		return errors
	}
	
	static func createFile(from bytes: [UInt8]?) throws {
		var post = try Post(from: bytes)

		guard
			FileManager.default.createFile(
				atPath: postsFolderPath + "/\(post.path)",
				contents: post.fileData)
		else { throw "Couldn't create file at \(post.path)" }
		
		post.saveOrUpdate()
	}
	
	private static func postsFolder() throws -> [String] {
		do {
			let paths = try FileManager.default.contentsOfDirectory(atPath: postsFolderPath)
			return paths.filter { $0.hasSuffix(".md") }
		}
		catch let error as NSError {
			throw error.localizedDescription
		}
	}
	
	private static func post(from path: String) throws -> Post {
		guard
			let data = FileManager.default.contents(atPath: "\(postsFolderPath)/\(path)"),
			let contents = String(data: data, encoding: .utf8)
		else { throw "Can't read contents." }
		
		let contentSplit = contents.components(separatedBy: "\n\n")
		
		guard contentSplit.count > 1 else { throw "Malformed content, probably no title." }
		
		let title = contentSplit[0]
		let body = contentSplit.dropFirst().joined(separator: "\n\n")
		let name = FileManager.default.displayName(atPath: path)
		let nameSplit = name.components(separatedBy: "-")
		
		guard nameSplit.count > 4 else { throw "Malformed file name." }
		
		let datetime = "\(nameSplit[0])-\(nameSplit[1])-\(nameSplit[2])-\(nameSplit[3])"
		
		return Post(title: title, body: body, datetime: datetime)
	}
	
}