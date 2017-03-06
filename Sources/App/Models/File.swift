//
//  File.swift
//  roland
//
//  Created by Roland Leth on 04.03.2017.
//
//

import Foundation

struct File {
	
	let title: String
	let body: String
	let datetime: String
	let path: String
	var safePath: String { return path.replacingOccurrences(of: " ", with: "%20") }
	let contents: String
	let contentsData: Data
	
	init(from bytes: [UInt8]?, testKey: String? = nil) throws {
		guard let bytes = bytes else { throw "Can't convert body to bytes." }
		guard
			case let data = Data(bytes: bytes),
			let bodyString = String(data: data, encoding: .utf8)
		else { throw "Got \(bytes), can't convert to utf8." }
		
		let split = bodyString.components(separatedBy: "&")
		
		func value(for key: String) -> String? {
			guard
				let pair = split.filter({ $0.contains("\(key)=") }).first,
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
			token == testKey ?? drop.syncKey
		else { throw "Malformed body: \(bodyString)." }
		
		self.init(title: title, body: body, datetime: datetime)
	}
	
	init(title: String, body: String, datetime: String) {
		self.title = title
		self.body = body
		self.datetime = datetime
		path = "/\(datetime)-\(title).md"
		contents = "\(title)\n\n\(body)"
		contentsData = Data(bytes: contents.bytes)
	}
	
	init(from post: Post) {
		self.init(title: post.title, body: post.rawBody, datetime: post.datetime)
	}
	
}
