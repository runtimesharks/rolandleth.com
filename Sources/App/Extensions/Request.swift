//
//  Request.swift
//  roland
//
//  Created by Roland Leth on 21.02.2017.
//
//

import Foundation
import HTTP

extension Request {
	
	private static var qi: Int { return Int(arc4random() % UInt32(quotes.count - 1)) }
	private static let quotes = [
		"Tables turn, bridges burn, you live and learn.",
		"Dream big, if you dare to dream.",
		"Your time is limited, so don't waste it living someone else's life.",
		"Be yourself, everyone else is taken.",
		"[...] avoid the trap of thinking you have something to lose.",
		"A lot can happen between now and \"never\"."
	]
	private static let emojis = ["💤", "🌟", "💭", "🗿", "👣", "🐶"]
	
	var isInsecure: Bool {
		// Specific to Heroku's SSL handling.
		return headers["x-forwarded-proto"]?.string == "https" && drop.environment == .production
	}
	
	var hasWWW: Bool {
		return uri.host.hasPrefix("www") && drop.environment == .production
	}
	
	var hasTrailingSlash: Bool {
		return uri.path.characters.last == "/" && uri.path.characters.count > 1
	}
	
	var quote: String { return Request.quotes[Request.qi] }
	var emoji: String { return Request.emojis[Request.qi] }
	
	var rootRedirect: Response {
		return Response(headers: headers, redirect: "/", permanently: false)
	}
	
}

extension Message {
	
	func setContentType(to type: ContentType) {
		headers["Content-Type"] = type.rawValue
	}
	
}

extension URLRequest {
	
	mutating func setContentType(to type: ContentType) {
		setValue(type.rawValue, forHTTPHeaderField: "Content-Type")
	}
	
}
