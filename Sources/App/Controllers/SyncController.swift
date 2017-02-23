//
//  SyncController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Vapor
import HTTP
import VaporPostgreSQL

struct SyncController {
	
	static func perform(with request: Request) throws -> ResponseRepresentable {
		return try JSON(node: "sync")
	}
	
}
