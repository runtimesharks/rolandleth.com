//
//  PostTests.swift
//  roland
//
//  Created by Roland Leth on 02.03.2017.
//
//

import Foundation
import XCTest

class PostTests: XCTestCase {
	
	private enum E {
		static let title = "Test title"
		static let link = "test-title"
		static let body = "*Italic*" + String(repeating: "a", count: 1000)
		static let htmlBody: String = E.body
			.replacingOccurrences(of: "*Italic*", with: "<p><em>Italic</em>")
		static let datetime = "2017-03-02-1649"
		static let termination = "&nbsp;[&hellip;]"
		static let continueReading: String = "<br/><a class=\"post-continue-reading\" href=\"/\(E.link)\" data-post-title=\"\(E.title)\">Continue reading &rarr;</a>"
	}
	
	private let calendar: Calendar = {
		var c = Calendar.current
		c.timeZone = DateFormatter.shared.timeZone
		return c
	}()
	private var post = Post(title: E.title, rawBody: E.body, datetime: E.datetime)
	
	
	// MARK: - Tests
	
	func testTitle() {
		XCTAssertEqual(E.title, post.title)
	}
	
	func testRawBody() {
		XCTAssertEqual(E.body, post.rawBody)
	}
	
	func testBody() {
		XCTAssertEqual(E.htmlBody + "</p>\n", post.body)
	}
	
	func testTruncatedBody() {
		// 600 + 12 characters for the tags.
		let truncatedBody = E.htmlBody[0..<612] + E.termination + "</p>" + E.continueReading
		XCTAssertEqual(truncatedBody, post.truncatedBody)
	}
	
	func testDateTime() {
		XCTAssertEqual(E.datetime, post.datetime)
	}
	
	func testLink() {
		XCTAssertEqual(E.link, post.link)
	}
	
	func testReadingTime() {
		XCTAssertEqual("", post.readingTime)
	}
	
	func testDate() {
		XCTAssertEqual("Mar 02, 2017", post.date)
	}
	
	func testTruncatedShortBodyEqualsBody() {
		let body = "Short body."
		let post = Post(title: "", rawBody: body, datetime: "")
		
		XCTAssertEqual("<p>\(body)</p>\n", post.truncatedBody)
	}
	
	func testBodyBetweenMinMaxLimitsDoesNotTruncate() {
		let repeated = String(repeating: "word ", count: 130)
		let body = repeated + "<p><em>Trimmed</p><em>"
		let expected = "<p>" + body + "</p>\n"
		post.rawBody = body
		
		XCTAssertEqual(expected, post.truncatedBody)
	}
	
	func testTruncateBodyWithOpenParagraphAtEndAddsTerminationBeforeClosingTag() {
		let repeated = String(repeating: "word ", count: 119)
		let body = repeated + "<p><em>Trimmed</p><em>" + repeated
		let expected = "<p>" + repeated + "<p><em>Trimm</em></p>" + E.termination + "</p>" + E.continueReading
		post.rawBody = body
		
		XCTAssertEqual(expected, post.truncatedBody)
	}
	
	func testTruncateBodyWithOpenBoldAtEndAddsTerminationAfterClosingTag() {
		let repeated = String(repeating: "word ", count: 119)
		let body = repeated + "<em><strong>Trimmed<em></strong>" + repeated
		let expected = "<p>" + repeated + "<em><strong>Trimm</strong></em>" + E.termination + "</p>" + E.continueReading
		post.rawBody = body
		
		XCTAssertEqual(expected, post.truncatedBody)
	}
	
	func testActualReadingTime() {
		let body = String(repeating: "word ", count: 675)
		let post = Post(title: "", rawBody: body, datetime: "")
		
		XCTAssertEqual("3 min read", post.readingTime)
	}
	
	func testShortReadingTime() {
		let body = String(repeating: "word ", count: 175)
		let post = Post(title: "", rawBody: body, datetime: "")
		
		XCTAssertEqual("45 sec read", post.readingTime)
	}
	
	func testBodyDidSet() {
		let body = String(repeating: "word ", count: 175)
		let htmlBody = "<p>\(body.droppingLast())</p>"
		post.rawBody = body
		
		XCTAssertEqual(body, post.rawBody)
		XCTAssertEqual(htmlBody + "\n", post.body)
		XCTAssertEqual(htmlBody[0..<602] + E.termination + "</p>" + E.continueReading, post.truncatedBody)
		XCTAssertEqual("45 sec read", post.readingTime)
	}
	
	func testDateMethod() {
		guard let date = Post.date(from: E.datetime) else { return XCTFail("Couldn't create date.") }
		let components = calendar.dateComponents([.year, .month, .day, .hour, .minute],
		                                         from: date)
		
		XCTAssertEqual(2017, components.year)
		XCTAssertEqual(3, components.month)
		XCTAssertEqual(2, components.day)
		XCTAssertEqual(16, components.hour)
		XCTAssertEqual(49, components.minute)
	}
	
	func testDateTimeMethod() {
		let date = Date()
		let datetime = Post.datetime(from: date)
		let components = calendar.dateComponents([.year, .month, .day, .hour, .minute],
		                                         from: date)
		
		let y = components.year!
		let M = components.month!.doubleDigitString
		let d = components.day!.doubleDigitString
		let h = components.hour!.doubleDigitString
		let m = components.minute!.doubleDigitString
		
		XCTAssertEqual("\(y)-\(M)-\(d)-\(h)\(m)", datetime)
	}
	
	func testInitFromFile() {
		let file: File! = try? File(path: "/2017-03-04-2232-Test title.md",
		                            contents: "Test title\n\nTest body")
		
		XCTAssertNotNil(file)
		
		let post: Post! = try? Post(from: file)
		
		XCTAssertNotNil(post)
		
		XCTAssertEqual(file.title, post.title)
		XCTAssertEqual(file.body, post.rawBody)
		XCTAssertEqual("<p>\(file.body)</p>\n", post.body)
		XCTAssertEqual("", post.readingTime)
		XCTAssertEqual("test-title", post.link)
		XCTAssertEqual("Mar 04, 2017", post.date)
		XCTAssertEqual(file.datetime, post.datetime)
		XCTAssertEqual(file.path, "\(post.datetime)-\(post.title).md")
		XCTAssertEqual(file.contents, "\(post.title)\n\n\(post.rawBody)")
	}
	
}
