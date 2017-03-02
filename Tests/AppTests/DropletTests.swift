//
//  DropletTests.swift
//  roland
//
//  Created by Roland Leth on 02.03.2017.
//
//

import Vapor
import GzipMiddleware
import XCTest

class DropletTests: XCTestCase {
	
	private let localDrop = Droplet().setUp().addRoutes()
	
	
	// MARK: - Tests
	
	func testPreparations() {
		let contains = localDrop
			.preparations
			.contains { String(describing: $0) == String(describing: Post.self) }
		
		XCTAssertTrue(contains)
	}
	
	func testMiddleware() {
		let actual: [Any] = [
			GzipMiddleware(),
			HeadersMiddleware(),
			RedirectMiddleware()
		]
		
		for middleware in actual {
			let contains = localDrop
				.middleware
				.contains { String(describing: $0) == String(describing: middleware) }
			
			XCTAssertTrue(contains)
		}
	}
	
	func testProvider() {
		let contains = localDrop
			.providers
			.contains { String(describing: $0) == "VaporPostgreSQL.Provider" }
		
		XCTAssertTrue(contains)
	}
	
	func testAddRoutes() {
		let expected = [
			"* POST /cmd.sync/create-post",
			"* GET ", "* GET /:id",
			"* GET /api/v1.0/about",
			"* GET /api/v1.0/page/:w0",
			"* GET /api/v1.0/post/:w0",
			"* GET /api/v1.0/archive",
			"* GET /api/v1.0/search",
			"* GET /downloads/:w0",
			"* GET /search", "* GET /search/:page",
			"* GET /sitemap.xml",
			"* GET /feed",
			"* GET /about",
			"* GET /cmd.sync/:w0",
			"* GET /cmd.sync/:w0/:w1",
			"* GET /projects",
			"* GET /projects/:w0",
			"* GET /archive",
			"* GET /privacy-policy"
		]
		
		XCTAssertEqual(expected, localDrop.router.routes)
	}
	
}
