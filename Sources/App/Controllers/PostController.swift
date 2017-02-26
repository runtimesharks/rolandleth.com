//
//  PostController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

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
		else { return nil }
		
		return post
	}
	
	static func display(with request: Request, link: String) throws -> ResponseRepresentable {
		guard let post = fetchPost(with: link) else {
			return try NotFoundController.display(with: request)
		}
		
		return try drop.view.make("post", [
			"title": post.title,
			"path": request.uri.path,
			"metadata": post.title,
			"post": post,
			"singlePost": true]
		)
	}

}
