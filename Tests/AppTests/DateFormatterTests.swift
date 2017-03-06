//
//  DateFormatterTests.swift
//  roland
//
//  Created by Roland Leth on 06.03.2017.
//
//

import XCTest

class DateFormatterTests: XCTestCase {
	
	func testShared() {
		let df = DateFormatter.shared
		
		XCTAssertEqual("yyyy-MM-dd-HHmm", df.dateFormat)
	}
	
	func testShortFormat() {
		XCTAssertEqual("MMM dd, yyyy", DateFormatter.shortFormat)
	}
	
	func testSetShortFormat() {
		let df = DateFormatter.shared.setShortFormat()
		
		XCTAssertEqual("MMM dd, yyyy", df.dateFormat)
	}
	
	func testDatetimeFormat() {
		XCTAssertEqual("yyyy-MM-dd-HHmm", DateFormatter.datetimeFormat)
	}
	
	func testSetDatetimeFormat() {
		let df = DateFormatter.shared.setDatetimeFormat()
		
		XCTAssertEqual("yyyy-MM-dd-HHmm", df.dateFormat)
	}
	
}
