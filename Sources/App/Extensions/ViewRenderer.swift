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
	"[...] avoid the trap of thinking you have something to lose.",
	"A lot can happen between now and \"never\"."
]
private let emojis = ["💤", "🌟", "💭", "🗿", "👣", "🐶"]

extension ViewRenderer {
	
	var quote: String { return quotes[qi] }
	var emoji: String { return emojis[qi] }
	
	func showResults(with params: [String: NodeRepresentable], for request: Request, posts: [Post], totalPosts: Int) throws -> ResponseRepresentable {
		let baseParams: [String: NodeRepresentable] = [
			"gap": 2,
			"doubleGap": 4,
			"posts": try posts.makeNode(),
			"pages": Int((Double(totalPosts) / Double(drop.postsPerPage)).rounded(.up)),
			"showPagination": totalPosts > drop.postsPerPage
		]
		
		let params = params + baseParams
		
		return try make("article-list", with: params, for: request)
	}
	
	func make(_ path: String, with params: [String: NodeRepresentable], for request: Request) throws -> View {
		let footerParams: [String: NodeRepresentable] = [
			"quote": quote,
			"emoji": emoji,
			"fullRoot": request.domain,
			"year": Calendar.current.component(.year, from: Date())
		]
		
		let metadataParams: [String: NodeRepresentable] = [
			"path": request.pathWithoutTrailingSlash,
			"metadata": params["title"] as? String ?? "" // Will be overwritten if it exists in the next step
		]
		
		let params = footerParams + metadataParams + params
		
		return try make(path, params)
	}
	
}
