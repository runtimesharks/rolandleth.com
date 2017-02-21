//
//  Post.swift
//  roland
//
//  Created by Roland Leth on 17.02.2017.
//
//

import Foundation
import Vapor

struct Post {
	
	var id: Node?
	var exists = false
	
	let title: String
	let body: String
	let truncatedBody: String
	let datetime: String
	let link: String
	let readingTime: String
	
	init(title: String, body: String, datetime: String, link: String, truncatedBody: String? = nil, readingTime: String? = nil) {
		self.id = nil
		self.title = title
		self.body = body
		self.datetime = datetime
		self.link = link
		self.truncatedBody = truncatedBody ?? Post.truncate(body, to: 500)
		self.readingTime = readingTime ?? Post.readingTime(for: body)
	}
	
}

extension Post: Model {
	
	init(node: Node, in context: Context) throws {
		id = try node.extract("id")
		title = try node.extract("title")
		body = try node.extract("body")
		datetime = try node.extract("datetime")
		link = try node.extract("link")
		truncatedBody = try node.extract("truncatedbody")
		readingTime = try node.extract("readingtime")
	}
	
	static func prepare(_ database: Database) throws {
		try database.create("posts") { posts in
			posts.id()
			posts.string("title", length: 9_999, optional: false, unique: false, default: nil)
			posts.string("body", length: 9_999, optional: false, unique: false, default: nil)
			posts.string("truncatedbody", length: 999, optional: false, unique: false, default: nil)
			posts.string("datetime", length: 70, optional: false, unique: false, default: nil)
			posts.string("link", length: 100, optional: false, unique: true, default: nil)
			posts.string("readingtime", length: 20, optional: false, unique: false, default: "")
		}
	}
	
	static func revert(_ database: Database) throws {
		try database.delete("posts")
	}
	
}

extension Post: NodeRepresentable {
	
	func makeNode(context: Context) throws -> Node {
		return try Node(node: [
			"id": id,
			"title": title,
			"body": body,
			"truncatedBody": truncatedBody,
			"datetime": datetime,
			"link": link,
			"readingTime": readingTime]
		)
	}
	
}

extension Post {
	
	static func readingTime(for text: String) -> String {
		let text = NSMutableString(string: text)
		let range = NSRange(location: 0, length: text.length)
		String.httpTagRegex.replaceMatches(in: text, range: range, withTemplate: "")
		
		let spaces = CharacterSet(charactersIn: " \n?!.,()[]{}=/*+-_")
		let a = text
			.components(separatedBy: spaces)
			.filter { !$0.isEmpty }
		
		let time = Double(a.count * 100 / 225) / 100
		let minutes = Int(time)
		
		let readingTime: String
		
		if time >= 1 {
			readingTime = "~ \(minutes) min read"
		}
		else {
			let minuteRemainder = time - Double(minutes)
			let seconds = Int(minuteRemainder * 60)
			
			switch seconds {
			case 0..<20: readingTime = ""
			case 20...30: readingTime = "~ \(25) sec read"
			case 30...50: readingTime = "~ \(45) sec read"
			default: readingTime = "~ 1 min to read"
			}
		}
		
		return readingTime
	}
	
	static func truncate(_ text: String, to size: Int, wordWrap: Bool = false) -> String {
		// The size of the actual string that will be visible, without HTML.
		var printedSize = 0
		// The starting position of the string that will be visible - starts after the current matched tag.
		var position = 0
		// The tags that were opened, so they can be closed when truncation ends.
		var tags: [String] = []
		// The output string, with HTML.
		var output = ""
		
		while printedSize < size, position < text.length {
			// The length of the remaining text, starting from our current position.
			let remainingLength = text.length - position
			// The range of the remaining text, starting from our current position.
			let remainingRange = NSRange(location: position, length: remainingLength)
			// The range of the first tag in our remaining text.
			var tagRange = String.httpTagRegex.rangeOfFirstMatch(in: text, range: remainingRange)
			
			if tagRange.location == NSNotFound || tagRange.length == NSNotFound {
				tagRange.location = text.length
				tagRange.length = 0
			}
			
			// The string of the tag.
			let tag = text.substring(with: text.range(from: tagRange))
			// The range of the string up to the tag, starting with the last saved position.
			let printedRange = text.range(from: position..<tagRange.location)
			// The string up to the tag.
			var printedString = text.substring(with: printedRange)
			
			// Update the length of the visible string.
			printedSize += printedString.length
			// Update the starting position of the visible string.
			position = tagRange.location + tagRange.length
			
			// Check if the printed size is bigger than the limit,
			// so we can trim the ones that are extra.
			let extra = printedSize - size
			var trimExtraCharacters = extra >= 0
			
			trimmingExtraCharacters: if trimExtraCharacters {
				let punctuation = " ?!.".characters.map { String($0) }
				var l: Int { return printedString.length }
				var c: String { return printedString.last }
				
				printedString.dropLast(extra)
				
				// If we want to word wrap, go back up to a whitespace or punctuation.
				guard wordWrap else { break trimmingExtraCharacters }
				
				while !punctuation.contains(c) {
					printedString.dropLast()
				}
			}
			
			if trimExtraCharacters {
				// Remove the last character if it's a whitespace,
				// since we're adding one along with the termination character.
				if !printedString.isEmpty, printedString.last == " " {
					printedString.dropLast()
				}
				
				// Remove the last character if it's a comma,
				// since it looks weird to end in one.
				if !printedString.isEmpty, printedString.last == "," {
					printedString.dropLast()
				}
			}
			
			output += printedString
			
			// If we trimmed characters, we don't need to add the current tag. We'd have to close it too.
			guard !trimExtraCharacters else { continue }
			
			output += tag
			
			// Empty tags, or escaped characters don't require closing.
			guard !tag.isEmpty, tag.first != "&", tag.last != ";" else { continue }
			// Images don't require closing.
			if tag.length > 4, tag[0..<4] == "<img" { continue }
			// If we're closing a tag, remove if from the stack.
			guard tag[1..<2] != "/" else {
				tags.removeLast()
				continue
			}
			
			tags.append(tag)
		}
		
		// We're assuming valid HTML, so we will iterate
		// over the open tags, in reverse, and close them in order.
		for (index, tag) in tags.reversed().enumerated() {
			let isHref = tag.contains("<a href")
			// Display the termination character before closing the tag, unless it's a href.
			// It would be wrong to display it after a paragraph or pre block.
			if index == 0, !isHref { output += " [&hellip;]" }
			// Close the tag.
			if isHref {
				output += "</a>"
			}
			else {
				output += "</\(tag[1..<tag.length - 1])>"
			}
			// If the last tag is a href, add the termination character after closing it.
			guard index == 0, isHref else { continue }
			output += " [&hellip;]"
		}
		
		return output
	}
	
}
