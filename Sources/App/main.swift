import Vapor

let drop = try Droplet.setup().addRoutes()

try drop.run()
