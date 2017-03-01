//
//  Int.swift
//  roland
//
//  Created by Roland Leth on 21.02.2017.
//
//

import Foundation

extension Int {
	
	var doubleDigitString: String {
		if self < 10 { return "0\(self)" }
		return "\(self)"
	}
	
	var tripleDigitString: String {
		if self < 10 { return "00\(self)" }
		if self < 100 { return "0\(self)" }
		return "\(self)"
	}
	
}