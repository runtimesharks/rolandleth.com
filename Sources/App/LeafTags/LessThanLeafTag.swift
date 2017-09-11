//
//  LessThanLeafTag.swift
//  roland
//
//  Created by Roland Leth on 23.02.2017.
//
//

import Leaf

struct LessThanLeafTag: BasicTag {
	let name = "lessThan"
	
	func run(arguments: ArgumentList) throws -> Node? {
		guard
			arguments.count == 2,
			let lhs = arguments[0]?.int,
			let rhs = arguments[1]?.int
		else { return nil }
		
		return Node(lhs < rhs)
	}
	
	func shouldRender(tagTemplate: TagTemplate, arguments: ArgumentList, value: Node?) -> Bool {
		return value?.bool == true
	}
	
}
