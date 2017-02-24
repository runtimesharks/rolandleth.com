//
//  PageController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Vapor
import HTTP
import VaporPostgreSQL

struct PageController {
	
	static func fetch(with request: Request, page: Int) throws -> ResponseRepresentable {
		let posts = try fetchPosts(for: page, with: request).makeNode()
		
		print("posts: \(posts.array!.count)")
		
		return try JSON(node: ["posts": posts])
	}
	
	private static func fetchPosts(for page: Int, with request: Request) -> [Post] {
		let posts = try? Post.query().sorted().paginated(to: page).run()
		
		return posts ?? []
	}
	
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
		guard case let posts = fetchPosts(for: page, with: request), !posts.isEmpty else {
			return try NotFoundController.display(with: request)
		}
		
		print("page: \(page), posts: \(posts.count)")
		
		let totalPosts = try Post.query().count()
		let params: [String: NodeRepresentable] = [
			"title": "Roland Leth",
			"metadata": "iOS, Ruby, Node and JS projects by Roland Leth.",
			"uriPath": "/",
			"path": "/\(page)",
			"page": page
		]
		
		return try drop.view.showResults(with: params,
		                                 for: request,
		                                 posts: posts,
		                                 totalPosts: totalPosts)
	}
	
}
