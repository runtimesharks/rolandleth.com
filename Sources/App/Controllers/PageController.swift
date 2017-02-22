//
//  PageController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct PageController {
	
	/// Attempts to display the page, redirecting to root if it's the first page, or to 404 if the page is invalid.
	static func display(with request: Request) throws -> ResponseRepresentable {
		let params = request.parameters
		
		if let page = try? params.extract("id") as Int {
			guard page > 1 else { return Response(redirect: "/") }
			guard request.uri.query?.isEmpty != false else { return Response(redirect: "/\(page)") }
			
			return try display(page: page, with: request)
		}
		else if let id = try? params.extract("id") as String {
			return try PostController.display(with: request, link: id)
		}
		else if request.uri.path == "/" {
			if request.uri.query?.isEmpty == false {
				return Response(redirect: "/")
			}
			
			return try display(page: 1, with: request)
		}
		
		return try NotFoundController.display(with: request)
	}
	
	private static func display(page: Int, with request: Request) throws -> ResponseRepresentable {
		guard
			let posts = try? Post.query()
				.limit(Post.postsPerPage, withOffset: Post.postsPerPage * (page - 1)).run(),
			!posts.isEmpty
			else { return try NotFoundController.display(with: request) }
		
		print("page: \(page), posts: \(posts.count)")
		
		return try JSON(node: posts)
	}
	
}
