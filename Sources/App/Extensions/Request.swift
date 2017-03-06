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
	
	var isSecure: Bool {
		// Specific to Heroku's SSL handling.
		return headers["x-forwarded-proto"]?.string == "https" || !drop.production
	}
	
	var hasWWW: Bool {
		return uri.host.hasPrefix("www") && drop.production
	}
	
	var hasTrailingSlash: Bool {
		return uri.path.characters.last == "/" && uri.path.characters.count > 1
	}
	
	var rootRedirect: Response {
		return Response(headers: headers, redirect: "/", permanently: false)
	}
	
	var pathWithoutTrailingSlash: String {
		guard hasTrailingSlash else { return uri.path }
		
		return uri.path.droppingLast()
	}
	
	var domain: String {
		guard drop.production else { return "http://localhost:\(drop.port)" }
		
		return "https://\(uri.host)"
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
