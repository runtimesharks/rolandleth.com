import Vapor

let drop = C.drop

drop.get("/feed", handler: FeedController.create)
drop.get("/sitemap.xml", handler: SitemapController.create)
drop.get("/about", handler: AboutController.display)
drop.get("/archive", handler: ArchiveController.display)
drop.get("/privacy-policy", handler: PrivacyController.display)
drop.get("/projects", handler: ProjectsController.display)
drop.get("/downloads", handler: DownloadsController.process)
drop.get("/cmd.sync", handler: SyncController.perform)
drop.get("/search", handler: SearchController.perform)
drop.get("/", ":id", handler: PageController.display)
drop.get("/", handler: PageController.display)

drop.run()
