//
//  NotFoundController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import HTTP

struct NotFoundController {
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		let params = [
			"title": "404"
		]
		
		if request.uri.path == "/search" {
			return try drop.view.make("not-found-search", with: params, for: request)
		}
		
		return try drop.view.make("not-found", with: params, for: request)
	}
	
}
