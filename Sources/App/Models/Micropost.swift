//
// Created by Roland Leth on 17/05/2018.
// 
//

import Foundation
import Vapor
import SwiftMarkdown
import FluentProvider

final class Micropost: NodeInitializable {
	
	static let blogPath = "microblog"
	let storage = Storage()
	var exists = false

	var link: String {
		return Micropost.blogPath + "/" + datetime
	}
	let datetime: String
	let content: String
	var title: String {
		guard let d = Post.date(from: datetime) else { return "" }
		
		return DateFormatter.shared.setShortFormat().string(from: d)
	}
	
	
	// MARK: - Init
	
	convenience init(from request: Request) throws {
		guard
			let bytes = request.body.bytes,
			!bytes.isEmpty
		else { throw "Can't convery body to bytes" }
		
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
		
		guard let content = value(for: "content") else { throw "Malformed body: \(bodyString)." }
		
		self.init(datetime: Post.datetime(from: Date()), content: try markdownToHTML(content))
	}
	
	init(datetime: String, content: String) {
		self.datetime = datetime
		self.content = content
	}

	required init(row: Row) throws {
		datetime = try row.get("datetime")
		content = try row.get("content")
	}
	
	init(node: Node) throws {
		datetime = try node.get("datetime")
		content = try node.get("content")
	}
	
}

extension Micropost: NodeRepresentable {
	
	func makeNode(in context: Context?) throws -> Node {
		return try Node(node: [
			"title": title,
			"content": content,
			"datetime": datetime,
			"link": link]
		)
	}
	
}

extension Micropost: Model {
	
	func makeRow() throws -> Row {
		var row = Row()
		
		try row.set("datetime", datetime)
		try row.set("content", content)
		
		return row
	}
	
}

extension Micropost: Preparation {
	
	static func prepare(_ database: Database) throws {
		try database.create(self) { microposts in
			microposts.id()
			microposts.string("content", length: 999, optional: false, unique: false, default: nil)
			microposts.string("datetime", length: 15, optional: false, unique: false, default: nil)
		}
	}
	
	static func revert(_ database: Database) throws {
		try database.delete(self)
	}
	
}
