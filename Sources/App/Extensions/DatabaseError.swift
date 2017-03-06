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
		guard "\(error)".contains("already exists") else {
			self = .generic
			return
		}
		
		self = .alreadyExists
	}
	
}
