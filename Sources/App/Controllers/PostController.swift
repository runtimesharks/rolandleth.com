//
//  PostController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

//import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct PostController {
	
	static func fetch(with request: Request, link: String) throws -> ResponseRepresentable {
		guard let post = fetchPost(with: link) else { return try JSON(node: ["post": [:]]) }
		return try JSON(node: ["post": post])
	}
	
	private static func fetchPost(with link: String) -> Post? {
		guard
			let query = try? Post.query().filter("link", .contains(sensitive: false), link),
			let post = try? query.first()
//			var post = try? query.first()
		else { return nil }
		
//		let group = DispatchGroup()
//		let datetime = "2013-12-04-1831"
//		group.enter()
//		Dropbox.fetchFile(at: "/posts/2017-01-30-1801-Breaking labeled scopes.md") { fileContents in
//			guard
//				let fileContents = fileContents,
//				!fileContents.isEmpty,
//				case let fileContentsSplit = fileContents.components(separatedBy: "\n\n"),
//				fileContentsSplit.count > 1,
//				let title = fileContentsSplit.first,
//				case let body = fileContentsSplit.dropFirst().joined(separator: "\n\n")
//				else { return group.leave() }
//			
////			let htmlBody = MarkNoteParser.toHtml(bodly)
//			var options = MarkdownOptions()
//			options.linkEmails = false
//			var md = Markdown(options: options)
//			let htmlBody = md.transform(body)
//			post = Post(title: title, body: htmlBody, datetime: datetime)
//			group.leave()
//		}
//		
//		_ = group.wait(timeout: .distantFuture)
		
		return post
	}
	
	static func display(with request: Request, link: String) throws -> ResponseRepresentable {
		guard let post = fetchPost(with: link) else {
			return try NotFoundController.display(with: request)
		}
		
		let params: [String: NodeRepresentable] = [
			"title": post.title,
			"post": post,
			"singlePost": true]
		
		return try drop.view.make("post", with: params, for: request)
	}

}
