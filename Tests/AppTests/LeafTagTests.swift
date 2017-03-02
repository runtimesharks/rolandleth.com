//
//  LeafTagTests.swift
//  roland
//
//  Created by Roland Leth on 02.03.2017.
//
//

import Leaf
import XCTest

class LeafTagTests: XCTestCase {
	
	private var arguments: [Argument] { return argumentsFirstLarger }
	private let argumentsFirstLarger: [Argument] = [.constant(value: "6"), .constant(value: "2")]
	private let argumentsLastLarger: [Argument] = [.constant(value: "2"), .constant(value: "6")]
	
	func testAdditionLeafTag() {
		let tag = AdditionLeafTag()
		guard let result = try? tag.run(arguments: arguments) else { return XCTFail("Addition failed.") }
		
		XCTAssertEqual("add", tag.name)
		XCTAssertEqual(8, result)
		XCTAssertNotEqual(9, result)
	}
	
	func testSubtractionLeafTag() {
		let tag = SubtractionLeafTag()
		guard let result = try? tag.run(arguments: arguments) else { return XCTFail("Subtraction failed.") }
		
		XCTAssertEqual("subtract", tag.name)
		XCTAssertEqual(4, result)
		XCTAssertNotEqual(5, result)
	}
	
	func testMultiplicationLeafTag() {
		let tag = MultiplicationLeafTag()
		guard let result = try? tag.run(arguments: arguments) else { return XCTFail("Multiplication failed.") }
		
		XCTAssertEqual("multiply", tag.name)
		XCTAssertEqual(12, result)
		XCTAssertNotEqual(13, result)
	}
	
	func testDivisionLeafTag() {
		let tag = DivisionLeafTag()
		guard let result = try? tag.run(arguments: arguments) else { return XCTFail("Division failed.") }
		
		XCTAssertEqual("divide", tag.name)
		XCTAssertEqual(3, result)
		XCTAssertNotEqual(4, result)
	}
	
	func testDictionaryIteratorLeafTagSuccess() {
		let tag = DictionaryIteratorLeafTag()
		let arguments: [Argument] = [
			.variable(path: [], value: ["k": "value"]),
			.constant(value: "k")
		]
		guard let result = try? tag.run(arguments: arguments) else { return XCTFail("Dictionary iterator success failed.") }
		
		XCTAssertEqual("forDictionary", tag.name)
		XCTAssertEqual("value", result)
	}
	
	func testDictionaryIteratorLeafTagFailure() {
		let tag = DictionaryIteratorLeafTag()
		let arguments: [Argument] = [
			.variable(path: [], value: ["k": "value"]),
			.constant(value: "kk")
		]
		guard let result = try? tag.run(arguments: arguments) else { return XCTFail("Dictionary iterator failure failed.") }
		
		XCTAssertEqual("forDictionary", tag.name)
		XCTAssertNil(result)
	}
	
	func testGreaterThanLeafTagSuccess() {
		let tag = GreaterThanLeafTag()
		guard let result = try? tag.run(arguments: argumentsFirstLarger) else { return XCTFail("GreaterThan success failed.") }
		
		XCTAssertEqual("greaterThan", tag.name)
		XCTAssertEqual(true, result)
	}
	
	func testGreaterThanLeafTagFailure() {
		let tag = GreaterThanLeafTag()
		guard let result = try? tag.run(arguments: argumentsLastLarger) else { return XCTFail("GreaterThan failure failed.") }
		
		XCTAssertEqual(false, result)
	}
	
	func testLessThanLeafTagSuccess() {
		let tag = LessThanLeafTag()
		guard let result = try? tag.run(arguments: argumentsLastLarger) else { return XCTFail("LessThan success failed.") }
		
		XCTAssertEqual("lessThan", tag.name)
		XCTAssertEqual(true, result)
	}
	
	func testLessThanLeafTagFailure() {
		let tag = LessThanLeafTag()
		guard let result = try? tag.run(arguments: argumentsFirstLarger) else { return XCTFail("LessThan failure failed.") }
		
		XCTAssertEqual(false, result)
	}
    
}
