import Vapor
import VaporPostgreSQL
import HTTP

let drop = Droplet().setUp().addRoutes()

drop.run()
