//
// Created by Roland Leth on 17/05/2018.
// 
//

import Vapor

struct MicropostController {
	
	static func fetch(with request: Request) throws -> ResponseRepresentable {
		let link = try request.parameters.next(String.self)
		let post = try fetchPost(with: link, and: request)
		
		return try JSON(node: ["post": post])
	}
	
	private static func fetchPost(with datetime: String, and request: Request) throws -> Micropost {
		let query = try Micropost.makeQuery().filter("datetime", .equals, datetime)
		
		guard
			let result = try? query.first(),
			let post = result
		else { throw RouterError.missingRoute(for: request) }
		
		return post
	}
	
	static func display(with request: Request, datetime: String) throws -> ResponseRepresentable {
		let post = try fetchPost(with: datetime, and: request)
		
		let params: [String: Any] = [
			"metadata": "Microposted on \(post.title)",
			"post": post,
			"singlePost": true
		]
		
		return try drop.view.make("micropost", with: params, for: request)
	}
	
}
