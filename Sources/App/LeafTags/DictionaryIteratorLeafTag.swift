//
//  DictionaryIteratorLeafTag.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Leaf

struct DictionaryIteratorLeafTag: BasicTag {
	let name = "forDictionary"
	
	func run(arguments: ArgumentList) throws -> Node? {
		guard
			arguments.count == 2,
			let lhs = arguments[0]?.object,
			let rhs = arguments[1]?.string
		else { return nil }
		
		return lhs[rhs]
	}
	
}
