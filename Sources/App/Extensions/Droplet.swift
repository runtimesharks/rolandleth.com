//
//  Droplet.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

//import GzipMiddleware
import Vapor
import PostgreSQLProvider
import LeafProvider

extension Droplet {
	
	var syncKey: String {
		return config["server", "syncKey"]?.string ?? ""
	}
	var dropboxKey: String {
		return config["server", "dropboxKey"]?.string ?? ""
	}
	var postsPerPage: Int {
		return config["server", "postsPerPage"]?.int ?? 10
	}
	var port: String {
		return config["server", "port"]?.string ?? "8000"
	}
	var production: Bool {
		return config.environment == .production
	}
	
	static func setup() throws -> Droplet {
		let config = try Config()
		try config.addProvider(LeafProvider.Provider.self)
		try config.addProvider(PostgreSQLProvider.Provider.self)
		
		config.addConfigurable(middleware: RedirectMiddleware(), name: "redirect")
		config.addConfigurable(middleware: HeadersMiddleware(), name: "headers")
		config.addConfigurable(middleware: AppErrorMiddleware(), name: "app-error")
		config.addConfigurable(middleware: AppFileMiddleware(publicDir: config.publicDir), name: "app-file")
//		config.addConfigurable(middleware: GzipMiddleware(), name: "gzip")
		
		config.preparations.append(Post.self)
		
		let drop = try Droplet(config)
		
		if let leaf = drop.view as? LeafRenderer {
			leaf.stem.register(GreaterThanLeafTag())
			leaf.stem.register(LessThanLeafTag())
			leaf.stem.register(AdditionLeafTag())
			leaf.stem.register(SubtractionLeafTag())
			leaf.stem.register(MultiplicationLeafTag())
			leaf.stem.register(DivisionLeafTag())
			leaf.stem.register(DictionaryIteratorLeafTag())
		}
		
		FeedController.logger = drop.console
		
		return drop
	}
	
	func addRoutes() -> Droplet {
		get("/feed", handler: FeedController.feed)
		get("/microfeed", handler: FeedController.microfeed)
		post("/micropub", handler: FeedController.micropub)
		get("/sitemap.xml", handler: SitemapController.create)
		get("/about", handler: AboutController.display)
		get("/archive", handler: ArchiveController.display)
		get("/privacy-policy", handler: PrivacyController.display)
		get("/projects", handler: ProjectsController.display)
		get("/projects", String.parameter, handler: ProjectsController.display)
		get("/downloads", String.parameter, handler: DownloadsController.process)
		get("/cmd.sync", String.parameter, handler: SyncController.perform)
		get("/cmd.sync", String.parameter, String.parameter, handler: SyncController.perform)
		post("/cmd.sync/create-post", handler: SyncController.create)
		get("/search", handler: SearchController.display)
		get("/search", ":page", handler: SearchController.display)
		get("/", ":id", handler: PageController.display)
		get("/", handler: PageController.display)
		
		get("/api/v1.0/about", handler: AboutController.create)
		get("/api/v1.0/archive", handler: ArchiveController.create)
		get("/api/v1.0/page", Int.parameter, handler: PageController.fetch)
		get("/api/v1.0/post", String.parameter, handler: PostController.fetch)
		get("/api/v1.0/search", handler: SearchController.perform)
		
		return self
	}
	
}
