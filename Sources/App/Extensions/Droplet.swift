//
//  Droplet.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import GzipMiddleware
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
	var port: String {
		return config["servers", "default", "port"]?.string ?? "8000"
	}
	var production: Bool {
		return environment == .production
	}
	
	func setUp() -> Droplet {
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
		middleware.insert(GzipMiddleware(), at: 0) // Then we gzip the whole thing.
		middleware.insert(HeadersMiddleware(), at: 0) // Then we add required headers.
		middleware.insert(RedirectMiddleware(), at: 0) // First we redirect, if needed.
		try? addProvider(VaporPostgreSQL.Provider.self)
		
		return self
	}
	
	func addRoutes() -> Droplet {
		get("/feed", handler: FeedController.create)
		get("/sitemap.xml", handler: SitemapController.create)
		get("/about", handler: AboutController.display)
		get("/archive", handler: ArchiveController.display)
		get("/privacy-policy", handler: PrivacyController.display)
		get("/projects", handler: ProjectsController.display)
		get("/projects", String.self, handler: ProjectsController.display)
		get("/downloads", String.self, handler: DownloadsController.process)
		get("/cmd.sync", String.self) { return try SyncController.perform(with: $0, key: $1) }
		get("/cmd.sync", String.self, String.self, handler: SyncController.perform)
		post("/cmd.sync/create-post", handler: SyncController.create)
		get("/search", handler: SearchController.display)
		get("/search", ":page", handler: SearchController.display)
		get("/", ":id", handler: PageController.display)
		get("/", handler: PageController.display)
		
		get("/api/v1.0/about", handler: AboutController.create)
		get("/api/v1.0/archive", handler: ArchiveController.create)
		get("/api/v1.0/page", Int.self, handler: PageController.fetch)
		get("/api/v1.0/post", String.self, handler: PostController.fetch)
		get("/api/v1.0/search", handler: SearchController.perform)
		
		return self
	}
	
}
