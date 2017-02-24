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
			"title": "404",
			"metadata": "Development thoughts by Roland Leth",
			"path": request.uri.path
		]
		
		if request.uri.path == "/search" {
			return try drop.view.make("not-found-search", params)
		}
		
		return try drop.view.make("not-found", params)
	}
	
}
