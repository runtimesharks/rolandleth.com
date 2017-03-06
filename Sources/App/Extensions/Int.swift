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
		guard self < 10 else { return "\(self)" }
		
		return "0\(self)"
	}
	
	var tripleDigitString: String {
		guard self < 100 else { return "\(self)" }
		guard self < 10 else { return "0\(self)" }
		
		return "00\(self)"
	}
	
}
