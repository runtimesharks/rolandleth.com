import PackageDescription

let package = Package(
	name: "roland",
	dependencies: [
		.Package(url: "https://github.com/vapor/vapor.git", majorVersion: 1),
		.Package(url: "https://github.com/vapor/postgresql-provider", majorVersion: 1),
		.Package(url: "https://github.com/jhonny-me/GzipMiddleware.git", majorVersion: 0)
	],
	exclude: [
		"Config",
		"Database",
		"Localization",
		"Public",
		"Resources",
		]
)

