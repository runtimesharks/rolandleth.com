//
//  Dropbox.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation

struct Dropbox {
	
	static let apiRoot = "https://api.dropbox.com/1"
	static let apiContentRoot = "https://api-content.dropbox.com/1"
	static let authURL = "https://www.dropbox.com/1/oauth2/authorize?"
	
	static func getPostsFolder(completion: @escaping ([String: Any]) -> Void) {
		guard
			let url = URL(string: "\(apiRoot)/metadata/auto/posts/")
		else { return }
		
		let request = url.dropboxAuthenticatedRequest()
		
		URLSession.shared.dataTask(with: request) { (data, response, error) in
			guard
				let data = data,
				let rawJSON = try? JSONSerialization.jsonObject(
					with: data,
					options: .allowFragments
				),
				let JSON = rawJSON as? [String: Any]
			else { return completion([:])}
			
			completion(JSON)
		}.resume()
	}
	
	static func fetchFile(at path: String, completion: @escaping (String?) -> Void) {
		let path = path.replacingOccurrences(of: " ", with: "%20")
		let urlString = "\(Dropbox.apiContentRoot)/files/auto\(path)"
		guard let url = URL(string: urlString) else { return completion(nil) }
		
		let request = url.dropboxAuthenticatedRequest()
		
		URLSession.shared.dataTask(with: request) { (data, response, error) in
			guard
				let data = data,
				let file = String(data: data, encoding: .utf8)
			else { return }
			
			completion(file)
		}.resume()
	}
	
}
