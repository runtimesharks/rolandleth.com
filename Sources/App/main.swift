import Vapor
import VaporPostgreSQL

let drop = C.drop

drop.get { req in
	return try JSON(node: Post.all())
}

//drop.get("/") { _ in return }

drop.run()
