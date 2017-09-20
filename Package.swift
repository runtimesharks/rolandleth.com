import PackageDescription

let package = Package(
	name: "roland",
	dependencies: [
		.Package(url: "https://github.com/vapor/vapor.git", majorVersion: 2),
		.Package(url: "https://github.com/vapor/postgresql-provider.git", majorVersion: 2),
		.Package(url: "https://github.com/vapor-community/markdown.git", majorVersion: 0),
		.Package(url: "https://github.com/vapor/leaf-provider.git", majorVersion: 1),
		.Package(url: "https://github.com/czechboy0/Jay.git", majorVersion: 1)
	],
	exclude: [
		"Config",
		"Database",
		"Localization",
		"Public",
		"Resources",
		]
)

