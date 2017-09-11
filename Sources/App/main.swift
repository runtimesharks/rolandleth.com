import Vapor

let drop = try Droplet.setUp().addRoutes()

try drop.run()
