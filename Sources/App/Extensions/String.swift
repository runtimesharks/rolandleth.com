//
//  String.swift
//  roland
//
//  Created by Roland Leth on 20.02.2017.
//
//

import Foundation

extension String: Error { }

extension String {
	
	var length: Int { return characters.count }
	var first: String { return self[0..<1] }
	var last: String { return self[length - 1..<length] }
	var nsRange: NSRange { return NSRange(location: 0, length: length) }
	var htmlEscaped: String {
		return replacingOccurrences(of: "&", with:"&amp;")
			.replacingOccurrences(of: "\"", with:"&quot;")
			.replacingOccurrences(of: "'", with:"&#39;")
			.replacingOccurrences(of: "<", with:"&lt;")
			.replacingOccurrences(of: ">", with:"&gt;")
	}
	
	subscript(i: Int) -> Character {
		return self[index(startIndex, offsetBy: i)]
	}
	
	subscript(i: Int) -> String {
		return String(self[i] as Character)
	}
	
	subscript(r: Range<Int>) -> String {
		return String(self[Range(uncheckedBounds: (lower: index(startIndex, offsetBy: r.lowerBound),
		                                    upper: index(startIndex, offsetBy: r.upperBound)))
		])
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
	
	mutating func dropLast(_ n: Int = 1) {
		self = self.droppingLast(n)
	}
	
	mutating func dropFirst(_ n: Int = 1) {
		self = self.droppingFirst(n)
	}
	
	func droppingFirst(_ n: Int = 1) -> String {
		return self[n..<length]
	}
	
	func droppingLast(_ n: Int = 1) -> String {
		return self[0..<length - n]
	}
	
	func range(from nsRange: NSRange) -> Range<String.Index> {
		let lower = index(startIndex, offsetBy: nsRange.location)
		let upper = index(lower, offsetBy: nsRange.length, limitedBy: endIndex) ?? endIndex
		
		return Range(uncheckedBounds: (lower: lower, upper: upper))
	}
	
	func range(from range: Range<Int>) -> Range<String.Index> {
		return Range(uncheckedBounds: (lower: index(startIndex, offsetBy: range.lowerBound),
		                               upper: index(startIndex, offsetBy: range.upperBound)))
	}
	
}
