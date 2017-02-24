//
//  HeadersMiddleware.swift
//  roland
//
//  Created by Roland Leth on 21.02.2017.
//
//

import HTTP

struct HeadersMiddleware: Middleware {
	
	func respond(to request: Request, chainingTo next: Responder) throws -> Response {
		let response = try next.respond(to: request)
		
		let age: Int

		if request.uri.path.contains("gif") {
			age = 86400 * 30 // A month for trustlogo gifs.
		}
		else if request.uri.path == "/" {
			age = 0 // None for the main page.
		}
		else {
			age = 86400 // A day for pages and posts.
		}
		
		response.headers["Cache-Control"] = "public, max-age=\(age)"
		// Disable the embedding of the site in an external one.
		response.headers["Content-Security-Policy"] = "frame-ancestors 'none'" // Future proof.
		response.headers["X-Frame-Options"] = "DENY" // Old and current.
		
		return response
	}
	
}
