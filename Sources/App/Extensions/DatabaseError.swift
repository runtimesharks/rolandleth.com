//
//  DatabaseError.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import Foundation

enum DatabaseError {
	case generic
	case alreadyExists
	
	init(_ error: Error) {
		if "\(error)".contains("already exists") {
			self = .alreadyExists
			return
		}
		
		self = .generic
	}
}
