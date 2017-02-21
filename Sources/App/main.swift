import Vapor
import VaporPostgreSQL
import Foundation

let drop = C.drop

drop.get { req in
	let p = Post(title: "Title one", body: "Short body", datetime: "2017-02-21-1702")
	dump(p)
	
	return try JSON(node: Post.all())
}

//drop.get("/") { _ in return }

drop.run()
