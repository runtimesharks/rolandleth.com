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
import Dispatch
import Jay

struct SyncController {
	
	static func perform(with request: Request, key: String, command: String = "") throws -> ResponseRepresentable {
		guard key == drop.syncKey else { return Response.rootRedirect }
		
		let success: Bool
		switch command {
		case "delete": success = sync(delete: true)
		case "create": return try drop.view.make("create-post", with: [:], for: request)
		default: success = sync()
		}
		
		guard success else { return JSON("Sync failed.") }
		
		return Response.rootRedirect
	}
	
	static func create(with request: Request) throws -> ResponseRepresentable {
		let data = Data(bytes: request.body.bytes!)
		let string = String(data: data, encoding: .utf8)!
		let split = string.components(separatedBy: "&")
		
		func value(for key: String) -> String? {
			guard
				let pair = split.filter({ $0.contains(key) }).first,
				case let split = pair.components(separatedBy: "="),
				split.count == 2,
				let value = split[1]
					.replacingOccurrences(of: "+", with: " ")
					.removingPercentEncoding
			else { return nil }
			
			return value
		}
		
		guard
			split.count == 4,
			let title = value(for: "title"),
			let body = value(for: "body"),
			let datetime = value(for: "datetime"),
			let token = value(for: "token"),
			token == drop.syncKey
		else { return Response.rootRedirect }
		
		let group = DispatchGroup()
		var post = Post(title: title, body: body, datetime: datetime)
		var fileCreated = false
		var response: [String: Any]? = [:]
		
		group.enter()
		
		post.createDropboxFile { success, res in
			fileCreated = success
			defer { group.leave() }
			guard success else { return response = res }
			post.saveOrUpdate()
		}
		
		_ = group.wait(timeout: DispatchTime(secondsFromNow: 20))
		
		guard fileCreated else {
			if let response = response {
				let jay = Jay(formatting: .prettified, parsing: .none)
				let bytes = try jay.dataFromJson(anyDictionary: response)
				return try JSON(bytes: bytes)
			}
			return try JSON(node: fileCreated)
		}
		
		return Response.rootRedirect
	}
	
	static func sync(delete performDelete: Bool = false) -> Bool {
		let group = DispatchGroup()
		var success = false
		
		group.enter()
		
		var contents: [[String: Any]] = []
		
		Dropbox.getPostsFolder { folder in
			defer { group.leave() }
			guard
				let folderContents = folder["contents"] as? [[String: Any]],
				!folderContents.isEmpty
			else { return }
			
			contents = folderContents
		}
		
		_ = group.wait(timeout: DispatchTime(secondsFromNow: 240))
		
		var dbPosts: [Post] = []
		
		contents.forEach { fileMetadata in
			guard
				let path = fileMetadata["path"] as? String,
				let fileName = path.components(separatedBy: "/").last,
				case let fileSplit = fileName.components(separatedBy: "-"),
				fileSplit.count > 4,
				case let datetime = "\(fileSplit[0])-\(fileSplit[1])-\(fileSplit[2])-\(fileSplit[3])"
			else { return }
			
			group.enter()
			
			Dropbox.fetchFile(at: path) { fileContents in
				guard
					let fileContents = fileContents,
					!fileContents.isEmpty,
					case let fileContentsSplit = fileContents.components(separatedBy: "\n\n"),
					fileContentsSplit.count > 1,
					let title = fileContentsSplit.first,
					case let body = fileContentsSplit.dropFirst().joined(separator: "\n\n")
				else { return group.leave() }
				
				var post = Post(title: title, body: body, datetime: datetime)
				
				if let fullModified = fileMetadata["modified"] as? String,
					fullModified.length > 21,
					case let rawModified = fullModified[5..<22],
					case let df = DateFormatter.shared,
					case _ = df.dateFormat = "d MMM yyyy HH:mm",
					let modifiedDate = df.date(from: rawModified),
					let modified = Post.datetime(from: modifiedDate) {
					post.modified = modified
				}
				
				if performDelete { dbPosts.append(post) }
				
				post.saveOrUpdate()
				success = true
				group.leave()
			}
			
			_ = group.wait(timeout: DispatchTime(secondsFromNow: 20))
		}
		
		guard performDelete, let posts = try? Post.all() else { return success }
		
		for post in posts {
			let existsInDropbox = dbPosts.contains {
				post.link == $0.link && post.datetime == $0.datetime
			}
			guard !existsInDropbox else { continue }
			
			try? post.delete()
		}
		
		return success
	}
	
}
