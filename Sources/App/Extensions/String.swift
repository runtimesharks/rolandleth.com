//
//  String.swift
//  roland
//
//  Created by Roland Leth on 20.02.2017.
//
//

import Foundation

extension String {
	
	subscript (range: Range<Int>) -> String {
		let start = index(startIndex, offsetBy: range.lowerBound, limitedBy: endIndex)
		let end = index(startIndex, offsetBy: range.upperBound, limitedBy: endIndex)
		return self[start!..<end!]
	}
	
	var length: Int { return characters.count }
	var first: String { return self[0..<1] }
	var last: String { return self[length - 1..<length] }
	
	mutating func dropLast(_ n: Int = 1) {
		self = self[0..<length - n]
	}
	
	func droppingLast(_ n: Int = 1) -> String {
		return self[0..<length - n]
	}
	
	static let httpTagRegex = try! NSRegularExpression(pattern: "</?([a-z]+)[^>]*>|&#?[a-zA-Z0-9]+;",
	                                                   options: .caseInsensitive)
	
	func range(from nsRange: NSRange) -> Range<String.Index> {
		return Range(uncheckedBounds: (lower: index(startIndex, offsetBy: nsRange.location),
		                               upper: index(startIndex, offsetBy: nsRange.location + nsRange.length)))
	}
	
	func range(from range: Range<Int>) -> Range<String.Index> {
		return Range(uncheckedBounds: (lower: index(startIndex, offsetBy: range.lowerBound),
		                               upper: index(startIndex, offsetBy: range.upperBound)))
	}
	
}
