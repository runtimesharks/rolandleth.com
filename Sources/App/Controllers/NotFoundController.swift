//
//  NotFoundController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct NotFoundController {
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		if request.uri.path == "/search" {
			return try JSON(node: "no results")
		}
		
		return try JSON(node: "not found")
	}
	
}
