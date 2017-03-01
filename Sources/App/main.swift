import Vapor
import VaporPostgreSQL
import HTTP

let drop = Droplet().setUp()

drop.get("/feed", handler: FeedController.create)
drop.get("/sitemap.xml", handler: SitemapController.create)
drop.get("/about", handler: AboutController.display)
drop.get("/archive", handler: ArchiveController.display)
drop.get("/privacy-policy", handler: PrivacyController.display)
drop.get("/projects", handler: ProjectsController.display)
drop.get("/projects", String.self, handler: ProjectsController.display)
drop.get("/downloads", String.self, handler: DownloadsController.process)
drop.get("/cmd.sync", String.self) { return try SyncController.perform(with: $0, key: $1) }
drop.get("/cmd.sync", String.self, String.self, handler: SyncController.perform)
drop.post("/cmd.sync/create-post", handler: SyncController.create)
drop.get("/search", handler: SearchController.display)
drop.get("/search", ":page", handler: SearchController.display)
drop.get("/", ":id", handler: PageController.display)
drop.get("/", handler: PageController.display)

drop.get("/api/v1.0/about", handler: AboutController.create)
drop.get("/api/v1.0/archive", handler: ArchiveController.create)
drop.get("/api/v1.0/page", Int.self, handler: PageController.fetch)
drop.get("/api/v1.0/post", String.self, handler: PostController.fetch)
drop.get("/api/v1.0/search", handler: SearchController.perform)

drop.run()
