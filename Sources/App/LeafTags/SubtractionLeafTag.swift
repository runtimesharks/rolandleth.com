//
//  SubtractionLeafTag.swift
//  roland
//
//  Created by Roland Leth on 23.02.2017.
//
//

import Leaf

struct SubtractionLeafTag: BasicTag {
	let name = "subtract"
	
	func run(arguments: ArgumentList) throws -> Node? {
		guard
			arguments.count == 2,
			let lhs = arguments[0]?.int,
			let rhs = arguments[1]?.int
		else { return nil }
		
		return Node(lhs - rhs)
	}
}
