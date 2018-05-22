// swift-tools-version:4.0

import PackageDescription

let package = Package(
	name: "rolandleth.com",
	products: [
		.executable(name: "App", targets: ["App"])
	],
	dependencies: [
		.package(url: "https://github.com/vapor/vapor.git", .upToNextMajor(from: "2.3.0")),
		.package(url: "https://github.com/vapor/postgresql-provider.git", .upToNextMajor(from: "2.1.0")),
		.package(url: "https://github.com/vapor-community/markdown.git", .upToNextMajor(from: "0.4.0")),
		.package(url: "https://github.com/vapor/leaf-provider.git", .upToNextMajor(from: "1.1.0")),
		.package(url: "https://github.com/czechboy0/Jay.git", .upToNextMajor(from: "1.0.0"))
	],
	targets: [
		.target(name: "App", 
		        dependencies: [
					"Vapor", 
					"PostgreSQLProvider",
					"SwiftMarkdown",
					"LeafProvider", 
					"Jay"
			],
		        exclude: [
					"Config",
					"Database",
					"Public",
					"Resources"
			]),
		.testTarget(name: "AppTests", dependencies: ["App", "Testing"])
	]
)
