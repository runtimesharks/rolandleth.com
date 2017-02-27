//
//  Dropbox.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation

struct Dropbox {
	
	private static let apiRoot = "https://api.dropbox.com/1"
	private static let apiContentRoot = "https://api-content.dropbox.com/1"
	
	static func getPostsFolder(completion: @escaping ([String: Any]) -> Void) {
		guard let url = URL(string: "\(apiRoot)/metadata/auto/posts/") else { return }
		
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
		let urlString = "\(apiContentRoot)/files/auto\(path)"
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
	
	static func createFile(at path: String, with title: String, and body: String, completion: @escaping (Bool, [String: Any]?) -> Void) {
		guard let url = URL(string: "\(apiContentRoot)/files_put/auto\(path)?overwrite") else {
			return completion(false, nil)
		}
		
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
				dbPath == path
			else { return completion(false, JSON) }
			
			completion(true, nil)
		}.resume()
	}
	
}
