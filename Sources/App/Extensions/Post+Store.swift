//
//  Post+Store.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation

extension Post {
	
	convenience init(from file: File) throws {
		guard
			case let fileContentsSplit = file.contents
				.components(separatedBy: "\n\n"),
			fileContentsSplit.count >= 2,
			let title = fileContentsSplit.first,
			case let body = fileContentsSplit.dropFirst().joined(separator: "\n\n")
		else { throw "Malformed content, probably no title." }
		
		self.init(title: title, rawBody: body, datetime: file.datetime)
	}
	
	static func save(from file: File) throws {
		let post = try Post(from: file)
		post.saveOrUpdate()
	}
	
}
