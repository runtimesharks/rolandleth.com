//
//  Constants.swift
//  roland
//
//  Created by Roland Leth on 21.02.2017.
//
//

import Foundation
import HTTP
import Vapor
import VaporPostgreSQL

struct C {
	
	private static let middleware: [Middleware] = [
		RedirectMiddleware(),
		HeadersMiddleware()
	]
	
	static let drop: Droplet = {
		let d = Droplet()
		
		d.preparations += Post.self
		d.middleware += middleware
		try? d.addProvider(VaporPostgreSQL.Provider.self)
		
		return d
	}()
	
	static var dateFormatter: DateFormatter {
		struct Static {
			static let formatter = DateFormatter()
		}
		
		// Reset every time and set the required properties outside
		Static.formatter.locale = Locale(identifier:"en_US_POSIX")
		Static.formatter.dateFormat = "MMM dd, yyyy"
		
		return Static.formatter
	}
	
}
