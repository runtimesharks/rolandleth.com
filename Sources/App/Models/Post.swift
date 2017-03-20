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
	
	// Model.
	var id: Node?
	var exists = false
	
	let title: String
	var rawBody: String {
		didSet {
			body = Post.html(from: rawBody)
			updateTruncatedBody()
			readingTime = rawBody.readingTime
		}
	}
	fileprivate(set) var body: String
	var truncatedBody = ""
	fileprivate(set) var readingTime: String
	let datetime: String
	let link: String
	let date: String
	var modified: String
	
	private mutating func updateTruncatedBody() {
		let truncation = body.truncated(to: 600)
		let truncationSuffix: String
		
		if truncation.performed {
			truncationSuffix = "<br/><a class=\"post-continue-reading\" href=\"/" + link + "\" data-post-title=\"" + title + "\">Continue reading &rarr;</a>"
		}
		else {
			truncationSuffix = ""
		}
		
		truncatedBody = truncation.text + truncationSuffix
	}
	
	init(title: String, rawBody: String, datetime: String) {
		self.id = nil
		self.title = title
		self.datetime = datetime
		self.rawBody = rawBody
		body = Post.html(from: rawBody)
		link = Post.link(from: title, with: datetime)
		date = Post.shortDate(from: datetime)
		modified = datetime
		readingTime = rawBody.readingTime
		updateTruncatedBody()
		
		// Not saving much by saving the data instead of always computing it,
		// and it's just 30ms on average, but sometimes it's up to 70-80ms.
		// Either way, the less loading time, the happier the user.
	}
	
}

extension Post: NodeInitializable {
	
	init(node: Node, in context: Context) throws {
		id = try node.extract("id")
		title = try node.extract("title")
		body = try node.extract("body")
		rawBody = try node.extract("rawbody")
		datetime = try node.extract("datetime")
		modified = try node.extract("modified")
		link = try node.extract("link")
		truncatedBody = try node.extract("truncatedbody")
		readingTime = try node.extract("readingtime")
		date = try node.extract("date")
	}
	
}

extension Post: NodeRepresentable {
	
	func makeNode(context: Context) throws -> Node {
		return try Node(node: [
			"id": id,
			"title": title,
			"body": body,
			"rawBody": rawBody,
			"truncatedBody": truncatedBody,
			"datetime": datetime,
			"link": link,
			"readingTime": readingTime,
			"date": date,
			"modified": modified]
		)
	}
	
}

// MARK: - Static methods
extension Post {
	
	/// Converts the `datetime` field into a string of "Jan 27, 2017" format.
	///
	/// - Returns: A string of "Jan 27, 2017" format, if a `Date` can be created from the `datetime` passed, or an empty string otherwise.
	fileprivate static func shortDate(from datetime: String) -> String {
		guard let d = date(from: datetime) else { return "" }
		return DateFormatter.shared.setShortFormat().string(from: d)
	}
	
	/// Converts the `datetime` field into a `Date`.
	///
	/// - Returns: A `Date` corresponding to the `datetime` passed, or `nil` if invalid.
	static func date(from datetime: String) -> Date? {
		return DateFormatter.shared.date(from: datetime)
	}
	
	/// Converts a `Date` into a string of yyyy-MM-dd format.
	///
	/// - Parameter date: The `Date` to be converted.
	/// - Returns: A string of yyyy-MM-dd format.
	static func datetime(from date: Date) -> String {
		return DateFormatter.shared.string(from: date)
	}
	
	/// Returns the variation for a link. --X means it's a post with a duplicate title. Rarely happens.
	///
	/// - Parameter link: The link to check.
	/// - Returns: The variation of the link, or `0` if it's the original.
	private static func variation(for link: String) -> Int {
		guard
			let v = link.components(separatedBy: "--").last,
			let variation = Int(v)
		else { return 0 }
		
		return variation
	}
	
	fileprivate static func html(from body: String) -> String {
		return MarkNoteParser.toHtml(body)
	}
	
	/// Creates a link out of a title.
	///
	/// - Parameters:
	///   - title: The post's title.
	///   - datetime: The post's datetime.
	/// - Returns: A safe link.
	static func link(from title: String, with datetime: String) -> String {
		let regex = try! NSRegularExpression(pattern: "([#,;!:'\"\\$\\?\\(\\)\\[\\]\\{\\}\\/\\\\]+)",
		                                     options: .caseInsensitive)
		let link = regex
			.stringByReplacingMatches(in: title, options: [], range: title.nsRange, withTemplate: "")
			.replacingOccurrences(of: "&", with: "and")
			.replacingOccurrences(of: " ", with: "-")
			.replacingOccurrences(of: ".", with: "-")
			.lowercased()
		
		guard
			let posts = try? query().filter("link", .equals, link).run()
				// Just in the rare case where we have post-title
				// and not only post-title--XX exists, but also post-title-extra.
				.filter({ $0.link == link || $0.link.contains("\(link)--") })
				.sorted(by: { variation(for: $0.link) < variation(for: $1.link) }),
			let lastLink = posts.last?.link
		else { return link }
		
		guard let postToUpdate = posts.filter({ $0.datetime == datetime }).first else {
			return link + "--\(variation(for: lastLink) + 1)"
		}
		
		return postToUpdate.link
	}
	
}

private extension String {
	
	/// Creates a friendly reading time text, in "X min/sec read" format.
	var readingTime: String {
		let spaces = CharacterSet(charactersIn: " \n?!.,()[]{}=/*+-_")
		let words = components(separatedBy: spaces)
			.filter { !$0.isEmpty }
		
		let time = Double(words.count * 100 / 225) / 100
		let minutes = Int(time)
		
		let readingTime: String
		
		if time >= 1 {
			readingTime = "\(minutes) min read"
		}
		else {
			let minuteRemainder = time - Double(minutes)
			let seconds = Int(minuteRemainder * 60)
			
			switch seconds {
			case 0..<20: readingTime = ""
			case 20...30: readingTime = "25 sec read"
			case 30...50: readingTime = "45 sec read"
			default: readingTime = "1 min read"
			}
		}
		
		return readingTime
	}
	
	/// Truncates a text to a number of characters, but only if it's longer than said number + 30%; otherwise it does nothing.
	///
	/// - Parameters:
	///   - text: The text to be truncated.
	///   - size: The size to be truncated to.
	///   - wordWrap: A flag which determines if the truncation should stop at a word boundary.
	/// - Returns: The truncated text, and a Bool which indicates if truncation happened.
	func truncated(to size: Int, wordWrap: Bool = false) -> (text: String, performed: Bool) {
		let regex = try? NSRegularExpression(pattern: "</?([a-z]+)[^>]*>|&#?[a-zA-Z0-9]+;",
		                                     options: .caseInsensitive)
		
		guard let tagRegex = regex else { return (self, false) }
		
		let shouldTruncate = tagRegex
			.stringByReplacingMatches(in: self, options: [], range: self.nsRange, withTemplate: "")
			.length > Int(Double(size) * 1.2)
		
		guard shouldTruncate else { return (self, false) }
		
		// The size of the actual string that will be visible, without HTML.
		var printedSize = 0
		// The starting position of the string that will be visible - starts after the current matched tag.
		var position = 0
		// The tags that were opened, so they can be closed when truncation ends.
		var tags: [String] = []
		// The output string, with HTML.
		var output = ""
		
		while printedSize < size, position < length {
			// The length of the remaining text, starting from our current position.
			let remainingLength = length - position
			// The range of the remaining text, starting from our current position.
			let remainingRange = NSRange(location: position, length: remainingLength)
			// The range of the first tag in our remaining text.
			var tagRange = tagRegex.rangeOfFirstMatch(in: self, options: [], range: remainingRange)
			
			if tagRange.location == NSNotFound || tagRange.length == NSNotFound {
				tagRange.location = length
				tagRange.length = 0
			}
			
			// The string of the tag.
			let tag = substring(with: range(from: tagRange))
			// The range of the string up to the tag, starting with the last saved position.
			let printedRange = range(from: position..<tagRange.location)
			// The string up to the tag.
			var printedString = substring(with: printedRange)
			
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
			
			// Tags with less than 2 characters, brs, or escaped characters don't require closing.
			guard
				tag.length > 2, tag != "<br/>",
				tag.first != "&", tag.last != ";"
				else { continue }
			// Images don't require closing.
			if tag.length > 4, tag.hasPrefix("<img") { continue }
			// If we're closing a tag, remove if from the stack.
			guard tag[1..<2] != "/" else {
				tags.removeLast()
				continue
			}
			
			tags.append(tag)
		}
		
		let termination = "&nbsp;[&hellip;]"
		
		// We're assuming valid HTML, so we will iterate
		// over the open tags, in reverse, and close them in order.
		for (index, tag) in tags.reversed().enumerated() {
			let isHref = tag.contains("<a href")
			let isPre = tag == "<pre>"
			let isP = tag == "<p>"
			let addTerminationBeforeClosing = isPre || isP
			
			// Display the termination character after closing the tag,
			// unless it's a paragraph or pre block.
			if index == tags.count - 1, addTerminationBeforeClosing {
				output += termination
			}
			
			// Close the tag.
			if isHref {
				output += "</a>"
			}
			else {
				output += "</\(tag[1..<tag.length - 1])>"
			}
			
			if index == tags.count - 1, !addTerminationBeforeClosing {
				output += termination
			}
		}
		
		if tags.isEmpty {
			output += termination
		}
		
		return (output, true)
	}
	
}
