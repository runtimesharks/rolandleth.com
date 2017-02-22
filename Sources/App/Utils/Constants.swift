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
		
		d.preparations = [Post.self]
		d.middleware.append(contentsOf: middleware)
		try? d.addProvider(VaporPostgreSQL.Provider.self)
		
		return d
	}()
	
}
