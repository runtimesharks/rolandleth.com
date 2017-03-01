//
//  JSON.swift
//  roland
//
//  Created by Roland Leth on 01.03.2017.
//
//

import Vapor
import Jay

extension Vapor.JSON {
	
	init(_ dictionary: [String: Any]) throws {
		let jay = Jay(formatting: .prettified, parsing: .none)
		let bytes = try jay.dataFromJson(anyDictionary: dictionary)
		try self.init(bytes: bytes)
	}
	
	init(_ string: String) {
		self.init(string.makeNode())
	}
	
}
