//
//  PostController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct PostController {

	static func display(with request: Request, link: String) throws -> ResponseRepresentable {
		guard let post = try? Post.query().filter("link", contains: link, sensitive: true).first() else {
			return try NotFoundController.display(with: request)
		}
		
		print("post: \(link)")
		
		return try JSON(node: post)
	}

}
