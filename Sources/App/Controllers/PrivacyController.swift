//
//  PrivacyController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct PrivacyController {
	
	static func display(with request: Request) throws -> ResponseRepresentable {
		return try JSON(node: "privacy")
	}
	
}
