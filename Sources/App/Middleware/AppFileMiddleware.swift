//
//  AppFileMiddleware.swift
//  roland
//
//  Created by Roland Leth on 06.06.2017.
//
//

import Foundation
import HTTP
import libc
import Vapor

// Credit goes to the Vapor team; this file is an exact replica,
// just that I wanted to unescape the path before serving it,
// since I have filnames with spaces and special characters.

/// Servers files from the supplied public directory
/// on not found errors.
public final class AppFileMiddleware: Middleware {
	
	private var publicDir: String
	private let loader = DataFile()
	private let chunkSize: Int
	
	public init(publicDir: String, chunkSize: Int? = nil) {
		// Remove last "/" from the publicDir if present, so we can directly append uri path from the request.
		self.publicDir = publicDir.finished(with: "/")
		self.chunkSize = chunkSize ?? 32_768 // 2^15
	}
	
	public func respond(to request: Request, chainingTo next: Responder) throws -> Response {
		do {
			return try next.respond(to: request)
		} catch RouterError.missingRoute {
			// Check in file system
			var path = request.uri.path
			guard !path.contains("../") else { throw HTTP.Status.forbidden }
			if path.hasPrefix("/") {
				path = String(path.dropFirst())
			}
			let filePath = publicDir + path
			let ifNoneMatch = request.headers["If-None-Match"]
			return try Response(filePath1: filePath, ifNoneMatch: ifNoneMatch, chunkSize: chunkSize, request: request)
		}
	}
	
}

public extension Response {
	
	public convenience init(filePath1: String, ifNoneMatch: String? = nil, chunkSize: Int = 2048, request: Request) throws {
		guard let filePath = filePath1.removingPercentEncoding else { throw RouterError.missingRoute(for: request) }
		
		try self.init(filePath: filePath, ifNoneMatch: ifNoneMatch, chunkSize: chunkSize)
	}
	
}
