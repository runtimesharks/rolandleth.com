import Vapor
import VaporPostgreSQL
import Foundation

let drop = C.drop

drop.get { req in
	
//	for _ in 0..<10 {
		var p1 = Post(title: "Title two", body: "Short y", datetime: "2017-02-21-1707")
//		var p2 = Post(title: "Title two", body: "Short body", datetime: "2017-02-21-1302")
	
	p1.saveOrUpdate()
	
	let start = Date()
		
	try Post.query().filter("link", contains: "title-one").run()
	
	let finish = Date()
	let executionTime = finish.timeIntervalSince(start)
	
	print(String(format: "Execution Time: %.4f", executionTime))
	
	return try JSON(node: Post.all())
}

//drop.get("/") { _ in return }

drop.run()
