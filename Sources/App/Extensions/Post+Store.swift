//
//  Post+Store.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation
import HTTP

extension Post {
	
	static func deleteFromDatabase(checking files: [Post]) {
		guard !files.isEmpty, let posts = try? Post.all() else { return }
		
		for post in posts {
			let exists = files.contains {
				post.link == $0.link && post.datetime == $0.datetime
			}
			guard !exists else { continue }
			
			try? post.delete()
		}
	}
	
	init(from bytes: [UInt8]?) throws {
		guard let bytes = bytes else { throw "Can't convert body to bytes." }
		guard
			case let data = Data(bytes: bytes),
			let bodyString = String(data: data, encoding: .utf8)
		else { throw "Got \(bytes), can't convert to utf8." }
		
		let split = bodyString.components(separatedBy: "&")
		
		func value(for key: String) -> String? {
			guard
				let pair = split.filter({ $0.contains(key) }).first,
				case let split = pair.components(separatedBy: "="),
				split.count == 2,
				let value = split[1]
					.replacingOccurrences(of: "+", with: " ")
					.removingPercentEncoding
			else { return nil }
			
			return value
		}
		
		guard
			split.count == 4,
			let title = value(for: "title"),
			let body = value(for: "body"),
			let datetime = value(for: "datetime"),
			let token = value(for: "token"),
			token == drop.syncKey
		else { throw "Malformed body: \(bodyString)." }
		
		self.init(title: title, body: body, datetime: datetime)
	}
	
}
