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
		guard
			let url = URL(string: "\(Dropbox.apiContentRoot)/files_put/auto\(path)?overwrite")
		else { return completion(false, nil) }
		
		let fileContents = "\(title)\n\n\(body)"
		let data = Data(bytes: fileContents.bytes)
		var request = url.dropboxAuthenticatedRequest()
		request.httpMethod = "PUT"
		request.httpBody = data
		request.setContentType(to: .plain)
		
		URLSession.shared.dataTask(with: request) { (data, response, error) in
			guard
				let data = data,
				let rawJSON = try? JSONSerialization.jsonObject(
					with: data,
					options: .allowFragments),
				let JSON = rawJSON as? [String: Any]
			else { return completion(false, nil) }
			
			guard
				JSON["error"] == nil,
				let dbPath = JSON["path"] as? String,
				dbPath == self.path
			else { return completion(false, JSON) }
			
			completion(true, nil)
		}.resume()
	}
	
}
