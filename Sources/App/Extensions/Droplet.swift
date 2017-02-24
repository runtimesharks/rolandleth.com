//
//  Droplet.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import HTTP
import Vapor
import VaporPostgreSQL

extension Droplet {
	
	func setUp() -> Self {
		if let leaf = view as? LeafRenderer {
			leaf.stem.register(GreaterThanLeafTag())
			leaf.stem.register(LessThanLeafTag())
			leaf.stem.register(AdditionLeafTag())
			leaf.stem.register(SubtractionLeafTag())
			leaf.stem.register(MultiplicationLeafTag())
			leaf.stem.register(DivisionLeafTag())
		}
		
		preparations += Post.self
		middleware += [
			RedirectMiddleware(),
			HeadersMiddleware()
			] as [Middleware]
		try? addProvider(VaporPostgreSQL.Provider.self)
		
		return self
	}
	
}
