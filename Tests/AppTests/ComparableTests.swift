//
//  ComparableTests.swift
//  roland
//
//  Created by Roland Leth on 03.03.2017.
//
//

import XCTest

class ComparableTests: XCTestCase {
	
	func testNilLessThanValue() {
		let r: Int? = 1
		XCTAssertTrue(nil < r)
	}
	
	func testValueLessThanValue() {
		let l: Int? = 1
		let r: Int? = 2
		
		XCTAssertTrue(l < r)
		XCTAssertFalse(r < l)
	}
	
	func testValueLessThanNil() {
		let l: Int? = 1
		XCTAssertFalse(l < nil)
	}
	
	func testNilGreaterThanValue() {
		let r: Int? = 1
		XCTAssertFalse(nil > r)
	}
	
	func testValueGreaterThanValue() {
		let l: Int? = 1
		let r: Int? = 2
		
		XCTAssertTrue(r > l)
		XCTAssertFalse(l > r)
	}
	
	func testValueGreaterThanNil() {
		let l: Int? = 1
		XCTAssertTrue(l > nil)
	}
	
	func testNilGreaterOrEqualThanValue() {
		let r: Int? = 1
		XCTAssertFalse(nil >= r)
	}
	
	func testValueGreaterOrEqualThanDifferentValue() {
		let l: Int? = 1
		let r: Int? = 2
		
		XCTAssertTrue(r >= l)
		XCTAssertFalse(l >= r)
	}
	
	func testValueGreaterOrEqualThanSameValue() {
		let l: Int? = 1
		let r: Int? = 1
		
		XCTAssertTrue(r >= l)
		XCTAssertTrue(l >= r)
	}
	
	func testValueGreaterOrEqualThanNil() {
		let l: Int? = 1
		XCTAssertTrue(l >= nil)
	}
	
	func testNilLessOrEqualThanValue() {
		let r: Int? = 1
		XCTAssertTrue(nil <= r)
	}
	
	func testValueLessOrEqualThanDifferentValue() {
		let l: Int? = 1
		let r: Int? = 2
		
		XCTAssertTrue(l <= r)
		XCTAssertFalse(r <= l)
	}
	
	func testValueLessOrEqualThanSameValue() {
		let l: Int? = 1
		let r: Int? = 1
		
		XCTAssertTrue(l <= r)
		XCTAssertTrue(r <= l)
	}
	
	func testValueLessOrEqualThanNil() {
		let l: Int? = 1
		XCTAssertFalse(l <= nil)
	}
	
}
