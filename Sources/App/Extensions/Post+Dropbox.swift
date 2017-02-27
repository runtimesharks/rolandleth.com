//
//  Post+Dropbox.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation

extension Post {
	
	func fetchDropboxFile(completion: @escaping (String?) -> Void) {
		Dropbox.fetchFile(at: path, completion: completion)
	}
	
	func createDropboxFile(completion: @escaping (Bool, [String: Any]?) -> Void) {
		Dropbox.createFile(at: path, with: title, and: body, completion: completion)
	}
	
}
