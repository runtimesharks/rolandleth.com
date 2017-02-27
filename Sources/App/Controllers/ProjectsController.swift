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
	
	private static let params = [
		"title": "Projects",
		"metadata": "iOS, Ruby, Node and JS projects by Roland Leth."
	]
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		return try drop.view.make("projects", with: params, for: request)
	}
	
	static func display(with request: Request, project: String) throws -> ResponseRepresentable {
		return try drop.view.make("Standalone/\(project).html", with: params, for: request)
	}
	
}
