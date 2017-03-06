//
//  Post+Store.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation

extension Post {
	
	init(from file: File) {
		self.init(title: file.title, body: file.body, datetime: file.datetime)
	}
	
}
