//
//  Constants.swift
//  roland
//
//  Created by Roland Leth on 21.02.2017.
//
//

import Foundation
import Vapor
import VaporPostgreSQL

struct C {
	
	static let drop: Droplet = {
		let d = Droplet()
		
		d.preparations = [Post.self]
		d.addConfigurable(middleware: RedirectMiddleware(), name: "redirects")
		d.addConfigurable(middleware: HeadersMiddleware(), name: "headers")
		try? d.addProvider(VaporPostgreSQL.Provider.self)
		
		return d
	}()
	
}
