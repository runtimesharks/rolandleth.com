import PackageDescription

let package = Package(
	name: "roland",
	dependencies: [
		.Package(url: "https://github.com/vapor/vapor.git", majorVersion: 1),
		.Package(url: "https://github.com/vapor/postgresql-provider", majorVersion: 1)
	],
	exclude: [
		"assets",
		"lib",
		"models",
		"routes",
		"views",
		
		"Config",
		"Database",
		"Localization",
		"Public",
		"Resources",
		]
)

