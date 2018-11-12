//
// Created by Roland Leth on 12/11/2018.
// 
//

import Vapor
import HTTP

struct LifeController {
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		let params = [
			"title": "Life",
			"metadata": "Roland Leth's thoughts about determination, habits and all-around self-improvement."
		]
		
		return try drop.view.make("life", with: params, for: request)
	}
	
	static func create(with request: Request) throws -> ResponseRepresentable {
		return try JSON(node: "life raw")
	}
	
}

