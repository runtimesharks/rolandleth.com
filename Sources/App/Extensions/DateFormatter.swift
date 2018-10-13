//
//  DateFormatter.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation

extension DateFormatter {

	static let shortFormat = "MMM dd, yyyy '•' HH:mm"
	static let shortDateFormat = "MMM dd, yyyy"
	static let datetimeFormat = "yyyy-MM-dd-HHmm"
	static let iso8601Format = "yyyy-MM-dd'T'HH:mm"

	@discardableResult
	func withShortDateFormat() -> DateFormatter {
		dateFormat = DateFormatter.shortDateFormat

		return self
	}

	@discardableResult
	func withShortFormat() -> DateFormatter {
		dateFormat = DateFormatter.shortFormat

		return self
	}

	@discardableResult
	func withDatetimeFormat() -> DateFormatter {
		dateFormat = DateFormatter.datetimeFormat

		return self
	}

	@discardableResult
	func withIso8601Format() -> DateFormatter {
		dateFormat = DateFormatter.iso8601Format

		return self
	}

	static var shared: DateFormatter {
		struct Static {
			static let formatter = DateFormatter()
		}

		// Reset every time and set the required properties outside
		Static.formatter.locale = Locale(identifier:"en_US_POSIX")
		// Since there's no easy and proper way to save the timezone of the file creation,
		// I'll just consider all posts to be created back home, in Bucharest ¯\-(ツ)-/¯
		Static.formatter.timeZone = TimeZone(identifier: "Europe/Bucharest")
		Static.formatter.withDatetimeFormat()

		return Static.formatter
	}

}
