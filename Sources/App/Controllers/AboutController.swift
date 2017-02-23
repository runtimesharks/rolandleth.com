//
//  AboutController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct AboutController {
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		return try JSON(node: "about")
	}
	
	static func create(with request: Request) throws -> ResponseRepresentable {
		return try JSON(node: "about raw")
	}
	
}
