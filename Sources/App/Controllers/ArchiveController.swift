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
		
		var groupedPosts: [[String: Any]] = []
		var gp: [String: [Post]] = [:]
		
		let allPosts = try Post.makeQuery().filteredPast().all()
		
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
			let posts = v.sorted(by: { $0.datetime >= $1.datetime })
			groupedPosts.append(["year": k,
			                     "posts": posts])
		}
		
		let params: [String: NodeRepresentable] = [
			"title": "Archive",
			"metadata": "Roland Leth's archive.",
			"posts": groupedPosts
		]
		
		return try drop.view.make("archive", with: params, for: request)
	}
	
	static func create(with request: Request) throws -> ResponseRepresentable {
		return try JSON(node: "archive raw")
	}
	
}
