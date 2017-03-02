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
		let path = request.uri.path
		let day = 86400 // I know, I know.
		let age: Int

		switch path {
		case _ where path.hasSuffix("gif")
			|| path.hasSuffix("png")
			|| path.hasSuffix("jpg"): age = day * 30 // A month for images.
		case _ where path.hasSuffix("css")
			|| path.hasSuffix("js"): age = day * 7 // A week for assets.
		case "/": fallthrough
		case "/search": age = 0 // None for the main page and search.
		default: age = day // A day for posts and pages.
		}
		
		// If the request already contains Content-Type and we're at root,
		// we're probably here from a redirect, so we shouldn't pass its Content-Type.
		if let contentType = request.headers["Content-Type"], path != "/" {
			response.headers["Content-Type"] = contentType
		}
		
		response.headers["Cache-Control"] = "public, max-age=\(age)"
		// Disable the embedding of the site in an external one.
		response.headers["Content-Security-Policy"] = "frame-ancestors 'none'" // Future proof.
		response.headers["X-Frame-Options"] = "DENY" // Old and current.
		
		return response
	}
	
}
