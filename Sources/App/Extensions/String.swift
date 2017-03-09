//
//  String.swift
//  roland
//
//  Created by Roland Leth on 20.02.2017.
//
//

import Foundation

#if os(Linux)
	typealias NSRegularExpression = RegularExpression
#endif

extension String: Error { }

extension String {
	
	var length: Int { return characters.count }
	var first: String { return self[0..<1] }
	var last: String { return self[length - 1..<length] }
	var nsRange: NSRange { return NSRange(location: 0, length: length) }
	
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
	
	func substring(begin: Int, end: Int) -> String {
		let range = NSRange(location: begin, length: end - begin + 1)
		
		return self[range]
	}
	
	func trim() -> String{
		return self.trimmingCharacters(in: .whitespaces)
	}
	
	func indexOf(_ toFind: String) -> Int {
		guard let range = range(of: toFind) else { return -1 }
		
		return distance(from: startIndex, to: range.lowerBound)
	}
	
	func contains3PlusandOnlyChars(char: String) -> Bool {
		return length >= 3
			&& indexOf(char) == 0
			&& replacingOccurrences(of: char, with: "").length == 0
	}
	
	func replaceAll(_ target: String, toStr: String) -> String {
		return replacingOccurrences(of: target, with: toStr)
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
		return Range(uncheckedBounds: (lower: index(startIndex, offsetBy: nsRange.location),
		                               upper: index(startIndex, offsetBy: nsRange.location + nsRange.length)))
	}
	
	func range(from range: Range<Int>) -> Range<String.Index> {
		return Range(uncheckedBounds: (lower: index(startIndex, offsetBy: range.lowerBound),
		                               upper: index(startIndex, offsetBy: range.upperBound)))
	}
	
}
