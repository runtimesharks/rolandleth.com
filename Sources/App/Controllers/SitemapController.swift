//
//  SitemapController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation
import Vapor
import HTTP
import VaporPostgreSQL

struct SitemapController {
	
	static func create(with request: Request) throws -> ResponseRepresentable {
		request.headers["Content-Type"] = "text/xml"
		
		return try JSON(node: "sitemap")
	}
	
}
