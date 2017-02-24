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


struct ArchiveController {
	
	static func display(with request: Request) throws -> ResponseRepresentable {
//		let months = [
//			"01": "January",
//			"02": "February",
//			"03": "March",
//			"04": "April",
//			"05": "May",
//			"06": "June",
//			"07": "July",
//			"08": "August",
//			"09": "September",
//			"10": "October",
//			"11": "November",
//			"12": "December"
//		]
		
		var groupedPosts: [Node] = []
		var gp: [String: [Post]] = [:]
		
		let allPosts = try Post.query().filteredPast().run()
		
		allPosts.forEach {
			guard let year = $0.datetime.components(separatedBy: "-").first else { return }
			
			if gp[year] == nil {
				gp[year] = [$0]
			}
			else {
				gp[year]!.append($0)
			}
		}
		
		for (k, v) in gp.sorted(by: { $0.0 >= $1.0 }) {
			let posts = try v
				.sorted(by: { $0.datetime >= $1.datetime })
				.makeNode()
			groupedPosts.append(["year": Node(k),
			                     "posts": posts])
		}
		
		return try drop.view.make("archive", [
			"title": "Archive",
			"metadata": "Roland Leth's archive.",
			"path": request.uri.path.makeNode(),
			"posts": groupedPosts.makeNode()]
		)
	}
	
	static func create(with request: Request) throws -> ResponseRepresentable {
		return try JSON(node: "archive raw")
	}
	
}
