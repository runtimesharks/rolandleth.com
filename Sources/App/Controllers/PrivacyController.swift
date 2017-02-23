//
//  PrivacyController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import HTTP

struct PrivacyController {
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		return try C.drop.view.make("privacy-policy", [
			"title": "Privacy Policy",
			"path": request.uri.path
			]
		)
	}
	
}
