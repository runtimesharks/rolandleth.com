//
//  PostController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

//import Foundation
//import Dispatch
import Vapor

struct PostController {
	
	static func fetch(with request: Request) throws -> ResponseRepresentable {
		let link = try request.parameters.next(String.self)
		let post = try fetchPost(with: link)
		return try JSON(node: ["post": post])
	}
	
	private static func fetchPost(with link: String) throws -> Post {
		let query = try Post.makeQuery().filter("link", .equals, link)
		guard
			let result = try? query.first(),
			let post = result
//			var post = result
		else { throw Abort.notFound }
		
//		let group = DispatchGroup()
//		let datetime = "2013-12-04-1831"
//		group.enter()
//		Dropbox.fetchFile(at: "/posts/2017-01-20-1601-Assign if not nil; if nil, then assign.md") { fileContents in
//			guard
//				let fileContents = fileContents,
//				!fileContents.isEmpty,
//				case let fileContentsSplit = fileContents.components(separatedBy: "\n\n"),
//				fileContentsSplit.count > 1,
//				let title = fileContentsSplit.first,
//				case var body = fileContentsSplit.dropFirst().joined(separator: "\n\n")
//				else { return group.leave() }
//			
//			body += "\nThis is ***a ~~test.~~***"
//			body += "\nThis is ==a ~~test~~.=="
//			body += "\nThis is *a **new** ~~great ==test==.~~!*"
//			
//			post = Post(title: title, body: body, datetime: datetime)
//			group.leave()
//		}
//		
//		_ = group.wait(timeout: .distantFuture)
		
		return post
	}
	
	static func display(with request: Request, link: String) throws -> ResponseRepresentable {
		let post = try fetchPost(with: link)
		
		let params: [String: Any] = [
			"title": post.title,
			"metadata": post.title,
			"post": post,
			"singlePost": true
		]
		
		return try drop.view.make("post", with: params, for: request)
	}

}
