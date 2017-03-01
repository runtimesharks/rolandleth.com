//
//  DateFormatter.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation

extension DateFormatter {
	
	static var shared: DateFormatter {
		struct Static {
			static let formatter = DateFormatter()
		}
		
		// Reset every time and set the required properties outside
		Static.formatter.locale = Locale(identifier:"en_US_POSIX")
		Static.formatter.dateFormat = "MMM dd, yyyy"
		
		return Static.formatter
	}
	
}
