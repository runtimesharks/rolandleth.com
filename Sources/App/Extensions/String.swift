//
//  String.swift
//  roland
//
//  Created by Roland Leth on 20.02.2017.
//
//

import Foundation

extension String {
	
	subscript(i: Int) -> Character {
		return self[index(startIndex, offsetBy: i)]
	}
	
	subscript(i: Int) -> String {
		return String(self[i] as Character)
	}
	
	subscript(r: Range<Int>) -> String {
		return substring(with: Range(uncheckedBounds: (lower: index(startIndex, offsetBy: r.lowerBound),
		                                               upper: index(startIndex, offsetBy: r.upperBound))
			)
		)
	}
	
	subscript(range: NSRange) -> String {
		let end = range.location + range.length
		return self[Range(uncheckedBounds: (lower: range.location, upper: end))]
	}
	
	subscript(substring: String) -> Range<String.Index>? {
		return range(of: substring,
		             options: .literal,
		             range: Range(uncheckedBounds: (lower: startIndex, upper: endIndex)),
		             locale: NSLocale.current)
	}
	
	var length: Int { return characters.count }
	var first: String { return self[0..<1] }
	var last: String { return self[length - 1..<length] }
	var nsRange: NSRange { return NSRange(location: 0, length: length) }
	
	mutating func dropLast(_ n: Int = 1) {
		self = self[0..<length - n]
	}
	
	func droppingLast(_ n: Int = 1) -> String {
		return self[0..<length - n]
	}
	
	static let httpTagRegex = try? NSRegularExpression(pattern: "</?([a-z]+)[^>]*>|&#?[a-zA-Z0-9]+;",
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
