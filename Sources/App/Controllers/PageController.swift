//
//  PageController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Vapor

struct PageController {
	
	static func fetch(with request: Request) throws -> ResponseRepresentable {
		let page = try request.parameters.next(Int.self)
		let posts = fetchPosts(for: page, with: request)
		
		return try JSON(["posts": posts])
	}
	
	private static func fetchPosts(for page: Int, with request: Request) -> [Post] {
		let posts = try? Post.makeQuery().sorted().paginated(to: page).all()
		
		return posts ?? []
	}
	
	/// Attempts to display the page, redirecting to root if it's the first page, or to 404 if the page is invalid.
	static func display(with request: Request) throws -> ResponseRepresentable {
		let params = request.parameters
		
		if let page = params["id"]?.int {
			guard page > 1 else { return request.rootRedirect }
			guard request.uri.query?.isEmpty != false else {
				return Response(headers: request.headers, redirect: "/\(page)")
			}
			
			return try display(page: page, with: request)
		}
		else if let id = params["id"]?.string {
			guard request.uri.query?.isEmpty != false else {
				return Response(headers: request.headers, redirect: "/\(id)")
			}
			
			return try PostController.display(with: request, link: id)
		}
		else if request.uri.path == "/" {
			if request.uri.query?.isEmpty == false {
				return request.rootRedirect
			}
			
			return try display(page: 1, with: request)
		}
		
		throw Abort.notFound
	}
	
	private static func display(page: Int, with request: Request) throws -> ResponseRepresentable {
		guard case let posts = fetchPosts(for: page, with: request), !posts.isEmpty else {
			throw Abort.notFound
		}
		
		let totalPosts = try Post.makeQuery().count()
		let params: [String: NodeRepresentable] = [
			"title": "Roland Leth",
			"root": "/",
			"page": page
		]
		
		return try drop.view.showResults(with: params,
		                                 for: request,
		                                 posts: posts,
		                                 totalPosts: totalPosts)
	}
	
}
