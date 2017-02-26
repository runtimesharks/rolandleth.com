//
//  ViewRenderer.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import HTTP
import Vapor

extension ViewRenderer {
	
	func showResults(with params: [String: NodeRepresentable], for request: Request, posts: [Post], totalPosts: Int) throws -> ResponseRepresentable {
		var params = params
		let baseParams: [String: NodeRepresentable] = [
			"gap": 2,
			"doubleGap": 4,
			"posts": try posts.makeNode(),
			"pages": Int((Double(totalPosts) / Double(drop.postsPerPage)).rounded(.up)),
			"showPagination": totalPosts > drop.postsPerPage
		]
		
		baseParams.forEach { params[$0] = $1 }
		
		return try drop.view.make("article-list", params, for: request)
	}
	
}
