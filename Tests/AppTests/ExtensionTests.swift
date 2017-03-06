//
//  ExtensionTests.swift
//  roland
//
//  Created by Roland Leth on 03.03.2017.
//
//

import Vapor
import XCTest

class ExtensionTests: XCTestCase {
	
	func testDictionaryOperators() {
		var dic1 = ["1": "2"]
		let dic2 = ["3": "4"]
		
		let sum = dic1 + dic2
		dic1 += dic2
		
		XCTAssertEqual(["1": "2", "3": "4"], sum)
		XCTAssertEqual(dic1, sum)
	}
	
	func testDatabaseErrorInit() {
		let e1: Error = "it already exists"
		let e2: Error = "it already"
		
		let de1 = DatabaseError(e1)
		let de2 = DatabaseError(e2)
		
		XCTAssertEqual(de1, .alreadyExists)
		XCTAssertEqual(de2, .generic)
	}
	
	func testIntToDoubleDigitString() {
		let i = 9
		let ii = 10
		
		XCTAssertEqual("09", i.doubleDigitString)
		XCTAssertEqual("10", ii.doubleDigitString)
	}
	
	func testIntToTripleDigitString() {
		let i = 9
		let ii = 10
		let iii = 100
		
		XCTAssertEqual("009", i.tripleDigitString)
		XCTAssertEqual("010", ii.tripleDigitString)
		XCTAssertEqual("100", iii.tripleDigitString)
	}
	
	func testJSONInitFromDictionary() {
		let d: [String: Any] = ["bool": true, "string": "string"]
		let node = Node.object(["bool": Node.bool(true), "string": Node.string("string")])
		let expected = JSON(node)
		guard let j = try? JSON(d) else { return XCTFail("Couldn't create JSON from dictionary.") }
		
		XCTAssertEqual(expected, j)
	}
	
	func testJSONInitFromString() {
		let s = "The string"
		let j = JSON(s)
		
		XCTAssertEqual(JSON(s.makeNode()), j)
	}
	
}
