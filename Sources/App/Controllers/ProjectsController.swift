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
		return try JSON(node: "projects")
	}
	
	static func display(with request: Request, project: String) throws -> ResponseRepresentable {
		let params = [
			"title": "Projects",
			"metadata": "iOS, Ruby, Node and JS projects by Roland Leth."
		]
		return try drop.view.make("Standalone/\(project).html", with: params, for: request)
	}
	
}
