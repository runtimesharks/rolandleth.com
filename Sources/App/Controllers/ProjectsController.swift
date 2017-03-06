//
//  ProjectsController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Vapor
import HTTP
import VaporPostgreSQL

struct ProjectsController {
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		let params = [
			"title": "Projects",
			"metadata": "iOS, Ruby, Node and JS projects by Roland Leth."
		]
		
		return try drop.view.make("projects", with: params, for: request)
	}
	
	static func display(with request: Request, project: String) throws -> ResponseRepresentable {
		return try drop.view.make("Standalone/\(project).html", with: [:], for: request)
	}
	
}
