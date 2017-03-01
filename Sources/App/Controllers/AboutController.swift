//
//  AboutController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Vapor
import HTTP

struct AboutController {
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		let params = [
			"title": "About",
			"metadata": "Some information about the blog. Details, résumé and contact information about Roland Leth."
		]
		return try drop.view.make("about", with: params, for: request)
	}
	
	static func create(with request: Request) throws -> ResponseRepresentable {
		return try JSON(node: "about raw")
	}
	
}
