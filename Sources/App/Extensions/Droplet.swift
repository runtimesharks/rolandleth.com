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
	
	var syncKey: String {
		return config["servers", "default", "syncKey"]?.string ?? ""
	}
	var dropboxKey: String {
		return config["servers", "default", "dropboxKey"]?.string ?? ""
	}
	var postsPerPage: Int {
		return config["servers", "default", "postsPerPage"]?.int ?? 10
	}
	
	func setUp() -> Self {
		if let leaf = view as? LeafRenderer {
			leaf.stem.register(GreaterThanLeafTag())
			leaf.stem.register(LessThanLeafTag())
			leaf.stem.register(AdditionLeafTag())
			leaf.stem.register(SubtractionLeafTag())
			leaf.stem.register(MultiplicationLeafTag())
			leaf.stem.register(DivisionLeafTag())
			leaf.stem.register(DictionaryIteratorLeafTag())
		}
		
		preparations += Post.self
		middleware += [
			RedirectMiddleware(),
			HeadersMiddleware()
		] as [Middleware]
		try? addProvider(VaporPostgreSQL.Provider.self)
		
		return self
	}
	
	func createDummyData() {
		var p5 = Post(title: "Title fivee", body: "Short", datetime: "2017-12-12-2010")
		var p6 = Post(title: "Title sixx", body: "Short", datetime: "2017-02-10-2010")
		var p7 = Post(title: "Title sevenn", body: "Short", datetime: "2017-02-11-2010")
		var p8 = Post(title: "Title eightt", body: "Short", datetime: "2016-09-10-2010")
		var p1 = Post(title: "Title onee", body: "Short", datetime: "2016-10-10-2010")
		var p2 = Post(title: "Title twoo", body: "Short", datetime: "2016-11-10-2010")
		var p3 = Post(title: "Title threee", body: "Short", datetime: "2015-09-10-2010")
		var p4 = Post(title: "Title fourr", body: "Short", datetime: "2015-10-10-2010")
		
		p1.saveOrUpdate()
		p2.saveOrUpdate()
		p3.saveOrUpdate()
		p4.saveOrUpdate()
		p5.saveOrUpdate()
		p6.saveOrUpdate()
		p7.saveOrUpdate()
		p8.saveOrUpdate()
	}
	
}
