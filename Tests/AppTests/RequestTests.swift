//
//  RequestTests.swift
//  roland
//
//  Created by Roland Leth on 03.03.2017.
//
//

import HTTP
import XCTest

class RequestTests: XCTestCase {
	
	func testHasTrailingSlash() {
		let request = try? Request(method: .get, uri: "https://www.rolandleth.com/title/")
		XCTAssertEqual(true, request?.hasTrailingSlash)
	}
	
	func testDoesNotHaveTrailingSlash() {
		let request = try? Request(method: .get, uri: "https://www.rolandleth.com/title")
		XCTAssertEqual(false, request?.hasTrailingSlash)
	}
	
	func testRootRedirect() {
		let request = try? Request(method: .get, uri: "https://www.rolandleth.com/")
		request?.headers = ["k": "value"]
		let response = request?.rootRedirect
		
		XCTAssertEqual("value", response?.headers["k"])
	}
	
	func testSetContentTypeForRequest() {
		let request = try? Request(method: .get, uri: "https://www.rolandleth.com/")
		request?.setContentType(to: .json)
		
		XCTAssertEqual(ContentType.json.rawValue, request?.contentType)
	}
	
	func testSetContentTypeForURLRequest() {
		var request = URLRequest(url: URL(string: "https://rolandleth.com")!)
		request.setContentType(to: .json)
		
		XCTAssertEqual(ContentType.json.rawValue, request.allHTTPHeaderFields?["Content-Type"])
	}
	
}
