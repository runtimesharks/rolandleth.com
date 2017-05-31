//
//  StringTests.swift
//  roland
//
//  Created by Roland Leth on 03.03.2017.
//
//

import XCTest

class StringTests: XCTestCase {
	
	private let string = " abcdef gh ijll "
	
	
	// MARK: - Tests

	func testLength() {
		XCTAssertEqual(16, string.length)
	}
	
	func testFirst() {
		XCTAssertEqual(" ", string.first)
	}
	
	func testLast() {
		XCTAssertEqual(" ", string.first)
	}
	
	func testNsRange() {
		XCTAssertEqual(0, string.nsRange.location)
		XCTAssertEqual(16, string.nsRange.length)
	}
	
	func testIntSubscript() {
		XCTAssertEqual("b", string[2])
	}
	
	func testIntRangeSubscript() {
		XCTAssertEqual("bc", string[2..<4])
	}
	
	func testNsRangeSubscript() {
		let range = NSRange(location: 2, length: 2)
		XCTAssertEqual("bc", string[range])
	}
	
	func testStringSubscript() {
		let start = string.index(string.startIndex, offsetBy: 2)
		let end = string.index(string.startIndex, offsetBy: 5)
		XCTAssertEqual(start..<end, string["bcd"])
	}
	
	func testTrim() {
		XCTAssertEqual("abcdef gh ijll", string.trim())
	}
	
	func testDropLast() {
		var s = string
		s.dropLast()
		
		XCTAssertEqual(" abcdef gh ijll", s)
	}
	
	func testDroppingLast() {
		XCTAssertEqual(" abcdef gh ijll", string.droppingLast())
	}
	
	func testDropFirst() {
		var s = string
		s.dropFirst()
		
		XCTAssertEqual("abcdef gh ijll ", s)
	}
	
	func testDroppingFirst() {
		XCTAssertEqual("abcdef gh ijll ", string.droppingFirst())
	}
	
	func testRangeFromNsRange() {
		let range = NSRange(location: 2, length: 2)
		let start = string.index(string.startIndex, offsetBy: 2)
		let end = string.index(string.startIndex, offsetBy: 4)
		
		XCTAssertEqual(start..<end, string.range(from: range))
	}
	
	func testRangeFromIntRange() {
		let start = string.index(string.startIndex, offsetBy: 2)
		let end = string.index(string.startIndex, offsetBy: 4)
		
		XCTAssertEqual(start..<end, string.range(from: 2..<4))
	}
	
}
