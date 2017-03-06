//
//  FileTests.swift
//  roland
//
//  Created by Roland Leth on 04.03.2017.
//
//

import XCTest

class FileTests: XCTestCase {
	
	let file = File(title: "Test title", body: "Test body", datetime: "2017-03-04-2222")
	
	
	// MARK: - Tests

	func testTitle() {
		XCTAssertEqual("Test title", file.title)
	}
	
	func testBody() {
		XCTAssertEqual("Test body", file.body)
	}
	
	func testDatetime() {
		XCTAssertEqual("2017-03-04-2222", file.datetime)
	}
	
	func testPath() {
		XCTAssertEqual("/2017-03-04-2222-Test title.md", file.path)
	}
	
	func testContents() {
		XCTAssertEqual("Test title\n\nTest body", file.contents)
	}
	
	func testFileContentsData() {
		XCTAssertEqual(Data("Test title\n\nTest body".bytes), file.contentsData)
	}
	
	func testInitFromBody() {
		let bytes = "title=Test+title&body=Test+body&datetime=2017-03-02-1814&token=r".bytes
		guard let file = try? File(from: bytes, testKey: "r") else { return XCTFail("Couldn't create from bytes.") }
		
		XCTAssertEqual("Test title", file.title)
		XCTAssertEqual("Test body", file.body)
		XCTAssertEqual("2017-03-02-1814", file.datetime)
	}
	
	func testInitFromInvalidBodyThrows() {
		let httpBody = "titl=Test+title&body=Test+body&datetime=2017-03-02-1814&token=r"
		let bytes = httpBody.bytes
		
		XCTAssertThrowsError(try File(from: bytes, testKey: "r")) { error in
			XCTAssertEqual("\(error)", "Malformed body: \(httpBody).")
		}
	}
	
	func testInitFromPost() {
		let post = Post(title: "Test title", body: "Test body", datetime: "2017-03-04-2225")
		let file = File(from: post)
		
		XCTAssertEqual(post.title, file.title)
		XCTAssertEqual(post.rawBody, file.body)
		XCTAssertEqual(post.datetime, file.datetime)
		XCTAssertEqual("/\(post.datetime)-\(post.title).md", file.path)
		XCTAssertEqual("\(post.title)\n\n\(post.rawBody)", file.contents)
	}
	
}
