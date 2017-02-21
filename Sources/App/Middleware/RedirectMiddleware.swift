//
//  RedirectMiddleware.swift
//  roland
//
//  Created by Roland Leth on 21.02.2017.
//
//

import Foundation
import HTTP
import URI

struct RedirectMiddleware: Middleware {
	
	func respond(to request: Request, chainingTo next: Responder) throws -> Response {
		guard
			request.isInsecure || request.hasWWW || request.hasTrailingSlash
		else { return try next.respond(to: request) }
		
		let path: String = {
			if request.hasTrailingSlash { return request.uri.path.droppingLast() }
			return request.uri.path
		}()
		
		let uri = URI(
			scheme: C.drop.environment == .production ? "https" : "http",
			userInfo: request.uri.userInfo,
			host: request.uri.host.replacingOccurrences(of: "www.", with: ""),
			port: request.uri.port,
			path: path,
			query: request.uri.query,
			rawQuery: request.uri.rawQuery,
			fragment: request.uri.fragment
		)
		
		return Response(redirect: uri.description)
	}
	
}
