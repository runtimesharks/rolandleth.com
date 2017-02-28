//
//  Dropbox.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation

struct Dropbox {
	
	private static let session: URLSession = {
		let config = URLSessionConfiguration.default
		let s = URLSession(configuration: config)
		return s
	}()
	private static let apiRoot = "https://api.dropbox.com/1"
	private static let apiContentRoot = "https://api-content.dropbox.com/1"
	
	static func getPostsFolder(completion: @escaping ([String: Any]) -> Void) {
		guard let url = URL(string: "\(apiRoot)/metadata/auto/posts/") else { return }
		
		let request = url.dropboxAuthenticatedRequest()
		
		session.dataTask(with: request) { (responseData, response, error) in
			guard
				let data = responseData,
				let rawJSON = try? JSONSerialization.jsonObject(
					with: data,
					options: .allowFragments
				),
				let JSON = rawJSON as? [String: Any]
			else {
				let d = responseData ?? Data(bytes: "Empty response".bytes)
				return completion(["rawData": d])
			}
			
			completion(JSON)
		}.resume()
	}
	
	static func fetchFile(at path: String, completion: @escaping (String?) -> Void) {
		let path = path.replacingOccurrences(of: " ", with: "%20")
		let urlString = "\(apiContentRoot)/files/auto\(path)"
		guard let url = URL(string: urlString) else { return completion(nil) }
		
		let request = url.dropboxAuthenticatedRequest()
		
		session.dataTask(with: request) { (data, response, error) in
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
		
		session.dataTask(with: request) { (data, response, error) in
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
