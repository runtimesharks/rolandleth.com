//
//  ArchiveController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct ArchiveController {
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		return try C.drop.view.make("archive", [
			"title": "Archive",
			"path": request.uri.path]
		)
	}
	
	static func create(with request: Request) throws -> ResponseRepresentable {
		return try JSON(node: "archive raw")
	}
	
}
