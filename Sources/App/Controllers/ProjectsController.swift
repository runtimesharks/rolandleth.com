//
//  ProjectsController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Vapor

struct ProjectsController {
	
	private static var standaloneProjects = [
		"iwordjuggle", "bouncyb", "sos-morse", "carminder", "expenses-planner"
	]
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		if let project = try? request.parameters.next(String.self), !project.isEmpty {
			guard standaloneProjects.contains(project) else { throw Abort.notFound }
			
			return try drop.view.make("Standalone/\(project).html", with: [:], for: request)
		}
		
		let params = [
			"title": "Projects",
			"metadata": "iOS, Ruby, Node and JS projects by Roland Leth."
		]
		
		return try drop.view.make("projects", with: params, for: request)
	}
	
}
