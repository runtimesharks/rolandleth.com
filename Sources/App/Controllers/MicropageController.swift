//
// Created by Roland Leth on 17/05/2018.
// 
//

import Vapor

struct MicropageController {
	
	private static func fetchPosts(for page: Int, with request: Request) -> [Micropost] {
		let posts = try? Micropost.makeQuery()
			.sort("datetime", .descending)
			.filteredPast()
			.all()
		
		return posts ?? []
	}
	
	/// Attempts to display the page, redirecting to root if it's the first page, or to 404 if the page is invalid.
	static func display(with request: Request) throws -> ResponseRepresentable {
		let params = request.parameters
		
		if let page = params["id"]?.int {
			guard page > 1 else { return request.rootRedirect }
			guard request.uri.query?.isEmpty != false else {
				return Response(headers: request.headers, redirect: "/microfeed/\(page)")
			}
			
			return try display(page: page, with: request)
		}
		else if let id = params["id"]?.string {
			guard request.uri.query?.isEmpty != false else {
				return Response(headers: request.headers, redirect: "/microfeed/\(id)")
			}
			
			return try MicropostController.display(with: request, datetime: id)
		}
		else if request.uri.path == "/microfeed" {
			if request.uri.query?.isEmpty == false {
				return Response(headers: request.headers, redirect: "/microfeed", .normal)
			}
			
			return try display(page: 1, with: request)
		}
		
		throw RouterError.missingRoute(for: request)
	}
	
	private static func display(page: Int, with request: Request) throws -> ResponseRepresentable {
		guard case let posts = fetchPosts(for: page, with: request), !posts.isEmpty else {
			throw Abort.notFound
		}
		
		let totalPosts = try Micropost.makeQuery().filteredPast().count()
		let params: [String: NodeRepresentable] = [
			"title": "Roland Leth",
			"root": "/microfeed",
			"page": page
		]
		
		return try drop.view.showMicroResults(with: params,
														  for: request,
														  posts: posts,
														  totalPosts: totalPosts)
	}
	
}
