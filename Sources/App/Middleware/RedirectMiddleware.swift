//
//  RedirectMiddleware.swift
//  roland
//
//  Created by Roland Leth on 21.02.2017.
//
//

import HTTP
import URI

struct RedirectMiddleware: Middleware {
	
	func respond(to request: Request, chainingTo next: Responder) throws -> Response {
		guard
			request.isInsecure || request.hasWWW
		else { return try next.respond(to: request) }
		
		let uri = URI(
			scheme: drop.environment == .production ? "https" : "http",
			userInfo: request.uri.userInfo,
			host: request.uri.host.replacingOccurrences(of: "www.", with: ""),
			port: request.uri.port,
			path: request.pathWithoutTrailingSlash,
			query: request.uri.query,
			rawQuery: request.uri.rawQuery,
			fragment: request.uri.fragment
		)
		
		return Response(redirect: uri.description)
	}
	
}
