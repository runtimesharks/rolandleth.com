//
//  ViewRenderer.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation
import HTTP
import Vapor

private var qi: Int {
	let max = quotes.count - 1
	#if os(Linux)
		return Int(random() % max)
	#else
		return Int(arc4random() % UInt32(max))
	#endif
}
private let quotes = [
	"Tables turn, bridges burn, you live and learn.",
	"Dream big, if you dare to dream.",
	"Your time is limited, so don't waste it living someone else's life.",
	"Be yourself, everyone else is taken.",
	"Whether you think you can or can not, you are right.",
	"[...] avoid the trap of thinking you have something to lose.",
	"A lot can happen between now and \"never\".",
	"Don’t wish it was easier, wish you were better"
]
private let emojis = ["💤", "🌟", "💭", "🗿", "👣", "🐶", "🦄", "🏇🏻"]

extension ViewRenderer {

	var quote: String { return quotes[qi] }
	var emoji: String { return emojis[qi] }

	func showMicroResults(with params: [String: Any], for request: Request, posts: [Micropost], totalPosts: Int) throws -> ResponseRepresentable {
		let baseParams: [String: NodeRepresentable] = [
			"gap": 2,
			"doubleGap": 4,
			"posts": posts,
			"pages": Int((Double(totalPosts) / Double(drop.postsPerPage)).rounded(.up)),
			"showPagination": totalPosts > drop.postsPerPage,
			"totalPosts": totalPosts,
			"singlePost": posts.count == 1
		]
		// If the current page has only one post, then it's also the last,
		// so we might as well consider this page a single post.

		let params = params + baseParams

		return try make("microarticle-list", with: params, for: request)
	}

	func showResults(with params: [String: Any], for request: Request, posts: [Post], totalPosts: Int) throws -> ResponseRepresentable {
		let baseParams: [String: NodeRepresentable] = [
			"gap": 2,
			"doubleGap": 4,
			"posts": posts,
			"pages": Int((Double(totalPosts) / Double(drop.postsPerPage)).rounded(.up)),
			"showPagination": totalPosts > drop.postsPerPage,
			"totalPosts": totalPosts,
			"singlePost": posts.count == 1
		]
		// If the current page has only one post, then it's also the last,
		// so we might as well consider this page a single post.

		let params = params + baseParams

		return try make("article-list", with: params, for: request)
	}

	func make(_ path: String, with params: [String: Any], for request: Request) throws -> View {
		let footerParams: [String: Any] = [
			"quote": quote,
			"emoji": emoji,
			"fullRoot": request.domain,
			"production": drop.production,
			"year": Calendar.current.component(.year, from: Date())
		]

		let metadataParams: [String: Any] = [
			"path": request.pathWithoutTrailingSlash,
			"metadata": params["metadata"] as? String ?? "iOS, Node and Ruby development thoughts by Roland Leth."
		]

		var params = footerParams + metadataParams + params
		let title = params["title"] as? String ?? "Roland Leth"

		if title != "Roland Leth" {
			params["title"] = "Roland Leth: " + title
		}

		return try make(path, params, for: request)
	}

}
