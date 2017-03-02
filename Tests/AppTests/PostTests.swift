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
	
	private let title = "Test title"
	private let link = "test-title"
	private let body = "*Italic*" + String(repeating: "a", count: 1000)
	private lazy var htmlBody: String = self.body.replacingOccurrences(of: "*Italic*",
	                                                                   with: "<p><em>Italic</em>")
	private let datetime = "2017-03-02-1649"
	private lazy var path: String = "\(self.datetime)-\(self.title).md"
	private lazy var fileContents: String = "\(self.title)\n\n\(self.body)"
	private let termination = "&nbsp;[&hellip;]"
	private lazy var continueReading: String = "<br/><a class=\"post-continue-reading\" href=\"/\(self.link)\" data-post-title=\"\(self.title)\">Continue reading &rarr;</a>"
	
	private var post: Post!

	override func setUp() {
		post = Post(title: title, body: body, datetime: datetime)
		super.setUp()
	}
	
	
	// MARK: - Tests
	
	func testTitle() {
		XCTAssertEqual(title, post.title)
	}
	
	func testRawBody() {
		XCTAssertEqual(body, post.rawBody)
	}
	
	func testBody() {
		XCTAssertEqual(htmlBody + "</p>\n", post.body)
	}
	
	func testTruncatedBody() {
		// 600 + 12 characters for the tags.
		let truncatedBody = htmlBody[0..<612] + termination + "</p>" + continueReading
		XCTAssertEqual(truncatedBody, post.truncatedBody)
	}
	
	func testDateTime() {
		XCTAssertEqual(datetime, post.datetime)
	}
	
	func testLink() {
		XCTAssertEqual(link, post.link)
	}
	
	func testPath() {
		XCTAssertEqual(path, post.path)
	}
	
	func testCloudPath() {
		XCTAssertEqual("/posts/\(path)", post.cloudPath)
	}
	
	func testReadingTime() {
		XCTAssertEqual("", post.readingTime)
	}
	
	func testFileContents() {
		XCTAssertEqual(fileContents, post.fileContents)
	}
	
	func testFileContentsData() {
		XCTAssertEqual(Data(fileContents.bytes), post.fileData)
	}
	
	func testDate() {
		XCTAssertEqual("Mar 02, 2017", post.date)
	}
	
	func testTruncatedShortBodyEqualsBody() {
		let body = "Short body."
		let post = Post(title: "", body: body, datetime: "")
		
		XCTAssertEqual("<p>\(body)</p>\n", post.truncatedBody)
	}
	
	func testBodyBetweenMinMaxLimitsDoesNotTruncate() {
		let repeated = String(repeating: "word ", count: 130)
		let body = repeated + "<p><em>Trimmed</p><em>"
		post.body = body
		
		XCTAssertEqual(body, post.truncatedBody)
	}
	
	func testTruncateBodyWithOpenParagraphAtEndAddsTerminationBeforeClosingTag() {
		let repeated = String(repeating: "word ", count: 119)
		let body = repeated + "<p><em>Trimmed</p><em>" + repeated
		let expected = repeated + "<p><em>Trimm</em>" + termination + "</p>" + continueReading
		post.body = body
		
		XCTAssertEqual(expected, post.truncatedBody)
	}
	
	func testTruncateBodyWithOpenBoldAtEndAddsTerminationAfterClosingTag() {
		let repeated = String(repeating: "word ", count: 119)
		let body = repeated + "<em><strong>Trimmed<em></strong>" + repeated
		let expected = repeated + "<em><strong>Trimm</strong></em>" + termination + continueReading
		post.body = body
		
		XCTAssertEqual(expected, post.truncatedBody)
	}
	
	func testActualReadingTime() {
		let body = String(repeating: "word ", count: 675)
		let post = Post(title: "", body: body, datetime: "")
		
		XCTAssertEqual("3 min read", post.readingTime)
	}
	
	func testShortReadingTime() {
		let body = String(repeating: "word ", count: 175)
		let post = Post(title: "", body: body, datetime: "")
		
		XCTAssertEqual("45 sec read", post.readingTime)
	}
	
	func testBodyDidSet() {
		let body = String(repeating: "word ", count: 175)
		post.body = body
		
		XCTAssertEqual(body, post.rawBody)
		XCTAssertEqual(body, post.body)
		// The last space is removed, since one is added via &nbsp;
		XCTAssertEqual(body[0..<599] + termination + continueReading, post.truncatedBody)
		XCTAssertEqual("45 sec read", post.readingTime)
	}
	
	func testDateMethod() {
		guard let date = Post.date(from: datetime) else { return XCTFail("Couldn't create date.") }
		let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute],
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
		let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute],
		                                                 from: date)
		let y = components.year!
		let M = components.month!.doubleDigitString
		let d = components.day!.doubleDigitString
		let h = components.hour!.doubleDigitString
		let m = components.minute!.doubleDigitString
		
		XCTAssertEqual("\(y)-\(M)-\(d)-\(h)\(m)", datetime)
	}
	
	func testInitFromBody() {
		let bytes = "title=Test+title&body=Test+body&datetime=2017-03-02-1814&token=r".bytes
		guard let post = try? Post(from: bytes, testKey: "r") else { return XCTFail("Couldn't create from bytes.") }
		
		XCTAssertEqual("Test title", post.title)
		XCTAssertEqual("<p>Test body</p>\n", post.body)
		XCTAssertEqual("2017-03-02-1814", post.datetime)
	}
	
	func testInitFromInvalidBodyThrows() {
		let httpBody = "titl=Test+title&body=Test+body&datetime=2017-03-02-1814&token=r"
		let bytes = httpBody.bytes
		XCTAssertThrowsError(try Post(from: bytes, testKey: "r")) { error in
			XCTAssertEqual("\(error)", "Malformed body: \(httpBody).")
		}
	}
	
}
