//
//  ErrorMiddleware.swift
//  roland
//
//  Created by Roland Leth on 16.04.2017.
//
//

import HTTP
import Vapor

struct ErrorMiddleware: Middleware {
	
	func respond(to request: Request, chainingTo next: Responder) throws -> Response {
		do {
			return try next.respond(to: request)
		}
		catch Abort.notFound {
			let notFound = try NotFoundController.display(with: request)
			return try notFound.makeResponse()
		}
	}
	
}
