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
	var modified: String
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
		
		try self.init(title: title, body: body, datetime: datetime)
	}
	
	private init(title: String, body: String, datetime: String, modified: String? = nil) throws {
		let contents = "\(title)\n\n\(body)"
		let path = "/\(datetime)-\(title).md"
		try self.init(path: path, contents: contents)
	}
	
	init(path: String, contents: String) throws {
		let path: String = {
			if path.hasPrefix(CloudStore.folderPath) {
				return path.replacingOccurrences(of: CloudStore.folderPath, with: "")
			}
			if path.hasPrefix("/") { return path.droppingFirst() }
			return path
		}()
		let contentSplit = contents.components(separatedBy: "\n\n")
		
		guard contentSplit.count > 1 else { throw "Malformed content, probably no title." }
		
		let title = contentSplit[0]
		let body = contentSplit.dropFirst().joined(separator: "\n\n")
		let nameSplit = path.components(separatedBy: "-")
		
		guard nameSplit.count >= 4 else { throw "Malformed file name." }
		
		let datetime = "\(nameSplit[0])-\(nameSplit[1])-\(nameSplit[2])-\(nameSplit[3])"
		
		self.title = title
		self.body = body
		self.datetime = datetime
		modified = datetime
		self.path = path
		self.contents = contents
		contentsData = Data(bytes: contents.bytes)
	}
	
	init(from post: Post) throws {
		try self.init(title: post.title, body: post.rawBody, datetime: post.datetime)
	}
	
}
