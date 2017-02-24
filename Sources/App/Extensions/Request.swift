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
	
}
