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
	var body: String {
		didSet {
			updateTruncatedBody()
			readingTime = Post.readingTime(for: body)
		}
	}
	var truncatedBody: String
	var readingTime: String
	let datetime: String
	let link: String
	let date: String
	let modified: String
	var path: String { return "/posts/\(datetime)-\(title).md" }
	
	private mutating func updateTruncatedBody() {
		let truncation = Post.truncate(body, to: 500)
		let truncationSuffix: String
		
		if truncation.performed {
			truncationSuffix = "<br/><a class=\"post-continue-reading\" href=\"/" + link + "\" data-post-title=\"" + title + "\">Continue reading &rarr;</a>"
		}
		else {
			truncationSuffix = ""
		}
		
		truncatedBody = truncation.text + truncationSuffix
	}
	
	/// Tests if the link matches another, by checking if they're equal and for --X variations.
	///
	/// - Parameter link: The link to check against.
	/// - Returns: A flag which indicates if the links are equal.
	func linkMatches(_ link: String) -> Bool {
		return self.link == link || self.link.contains("\(link)--")
	}
	
	init(title: String, body: String, datetime: String) {
		self.id = nil
		self.title = title
		self.body = body
		self.datetime = datetime
		link = Post.link(from: title, with: datetime)
		date = Post.shortDate(from: datetime)
		modified = datetime
		readingTime = Post.readingTime(for: body)
		truncatedBody = ""
		updateTruncatedBody()
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
			"readingTime": readingTime,
			"date": date,
			"modified": modified]
		)
	}
	
}

// MARK: - Static methods
extension Post {
	
	static func shortDate(from datetime: String) -> String {
		guard let d = Post.date(from: datetime) else { return "" }
		return DateFormatter.shared.string(from: d)
	}
	
	/// Converts the `datetime` field into a `Date`.
	///
	/// - Returns: A `Date` corresponding to the post's `datetime`, or `nil` if invalid.
	static func date(from datetime: String) -> Date? {
		let calendar = Calendar.current
		
		guard
			case let matches = datetime.components(separatedBy: "-"),
			matches.count == 4,
			let year = Int(matches[0]),
			let month = Int(matches[1]),
			let day = Int(matches[2]),
			case let time = matches[3],
			time.length == 4,
			let hour = Int(time[0..<2]),
			let minute = Int(time[2..<4])
			else { return nil }
		
		let components = DateComponents(year: year, month: month, day: day,
		                                hour: hour, minute: minute)
		
		return calendar.date(from: components)
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
	
	/// Creates a link out of a title.
	///
	/// - Parameters:
	///   - title: The post's title.
	///   - datetime: The post's datetime.
	/// - Returns: A safe link.
	fileprivate static func link(from title: String, with datetime: String) -> String {
		let regex = try! NSRegularExpression(pattern: "([#,;!:'\"\\$\\?\\(\\)\\[\\]\\{\\}\\/\\\\]+)",
		                                     options: .caseInsensitive)
		let link = regex
			.stringByReplacingMatches(in: title,
			                          range: title.nsRange,
			                          withTemplate: "")
			.replacingOccurrences(of: "&", with: "and")
			.replacingOccurrences(of: " ", with: "-")
			.replacingOccurrences(of: ".", with: "-")
			.lowercased()
		
		guard
			let posts = try? Post.query()
				.filter("link", contains: link, sensitive: true).run()
				// Just in the rare case where we have post-title
				// and not only post-title-XX exists, but also post-title-extra.
				.filter({ $0.linkMatches(link) })
				.sorted(by: { Post.variation(for: $0.link) < Post.variation(for: $1.link) }),
			let lastLink = posts.last?.link
		else { return link }
		
		guard let postToUpdate = posts.filter({ $0.datetime == datetime }).first else {
			return link + "--\(Post.variation(for: lastLink) + 1)"
		}
		
		return postToUpdate.link
	}
	
	/// Converts a `Date` into a string of yyyy-MM-dd format.
	///
	/// - Parameter date: The `Date` to be converted.
	/// - Returns: A string of yyyy-MM-dd format.
	static func datetime(from date: Date) -> String? {
		let c = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute],
		                                        from: date)
		guard
			let year = c.year,
			let month = c.month?.doubleDigitString,
			let day = c.day?.doubleDigitString,
			let hour = c.hour?.doubleDigitString,
			let minute = c.minute?.doubleDigitString
		else { return nil }
		
		return "\(year)-\(month)-\(day)-\(hour)\(minute)"
	}
	
	/// Creates a friendly reading time text.
	///
	/// - Parameter text: The text for which a reading time is desired.
	/// - Returns: A string in "X min/sec read" format.
	fileprivate static func readingTime(for text: String) -> String {
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
	
	/// Truncates a text to a number of characters, but only if it's longer than said number + 30%; otherwise it does nothing.
	///
	/// - Parameters:
	///   - text: The text to be truncated.
	///   - size: The size to be truncated to.
	///   - wordWrap: A flag which determines if the truncation should stop at a word boundary.
	/// - Returns: The truncated text, and a Bool which indicates if truncation happened.
	fileprivate static func truncate(_ text: String, to size: Int, wordWrap: Bool = false) -> (text: String, performed: Bool) {
		let shouldTruncate = String.httpTagRegex
			.stringByReplacingMatches(in: text,
			                          range: text.nsRange,
			                          withTemplate: "")
			.length > Int(Double(size) * 1.3)
		
		guard shouldTruncate else { return (text, false) }
		
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
		
		return (output, true)
	}
	
}
