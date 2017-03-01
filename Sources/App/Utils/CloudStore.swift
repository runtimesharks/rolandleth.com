//
//  CloudStore.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation
import Dispatch
import Jay

struct CloudStore {
	
	private static let session: URLSession = {
		let config = URLSessionConfiguration.default
		let s = URLSession(configuration: config)
		return s
	}()
	private static let apiRoot = "https://api.dropbox.com/1"
	private static let apiContentRoot = "https://api-content.dropbox.com/1"
	
	/// Reads all files in Dropbox, or the one that matches the `path` passed, and saves them to the database.
	///
	/// - Parameters:
	///   - performDelete: A flag which determines whether posts that exist in the database, but on as a file should be deleted or not.
	///   - path: The path of an individual post to be synced.
	/// - Returns: Returns a dictionary of errors, if any occured.
	static func perform(withDelete performDelete: Bool = false, for path: String) -> [String: Any] {
		let uriPath = path.isEmpty ? "-" : "\(path)"
		let group = DispatchGroup()
		var response: [String: Any] = ["success": false]
		
		group.enter()
		
		var contents: [[String: Any]] = []
		
		getPostsFolder { folder in
			defer { group.leave() }
			guard
				let folderContents = folder["contents"] as? [[String: Any]],
				!folderContents.isEmpty
			else { return response["folder"] = folder }
			
			contents = folderContents
		}
		
		_ = group.wait(timeout: DispatchTime(secondsFromNow: 240))
		
		if let _ = response["folder"] {
			return response
		}
		
		var dbPosts: [Post] = []
		
		for (i, fileMetadata) in contents.enumerated() {
			guard
				let path = fileMetadata["path"] as? String,
				let fileName = path.components(separatedBy: "/").last,
				case let fileSplit = fileName.components(separatedBy: "-"),
				fileSplit.count > 4,
				case let datetime = "\(fileSplit[0])-\(fileSplit[1])-\(fileSplit[2])-\(fileSplit[3])"
			else {
				response["metadata-\(i)"] = fileMetadata
				group.leave()
				continue
			}
			
			guard path.contains(uriPath) else { continue }
			
			group.enter()
			
			self.fetchFile(at: path) { file in
				guard
					let fileContents = file,
					!fileContents.isEmpty,
					case let fileContentsSplit = fileContents.components(separatedBy: "\n\n"),
					fileContentsSplit.count > 1,
					let title = fileContentsSplit.first,
					case let body = fileContentsSplit.dropFirst().joined(separator: "\n\n")
				else {
					response["contents-\(path)"] = file
					return group.leave()
				}
				
				var post = Post(title: title, body: body, datetime: datetime)
				
				if let fullModified = fileMetadata["modified"] as? String,
					fullModified.length > 21,
					case let rawModified = fullModified[5..<22],
					case let df = DateFormatter.shared,
					case _ = df.dateFormat = "d MMM yyyy HH:mm",
					let modifiedDate = df.date(from: rawModified),
					let modified = Post.datetime(from: modifiedDate) {
					post.modified = modified
				}
				
				if performDelete {
					dbPosts.append(post)
				}
				
				post.saveOrUpdate()
				response["success"] = true
				group.leave()
			}
			
			_ = group.wait(timeout: DispatchTime(secondsFromNow: 20))
		}
		
		if performDelete {
			Post.deleteFromDatabase(checking: dbPosts)
		}
		
		return response
	}
	
	/// Creates a file in Dropbox, by parsing the `POST` request.
	///
	/// - Parameter request: The request to parse.
	/// - Returns: A dictionary of errors, if any occurred.
	/// - Throws: Throws any errors its underlying methods will throw.
	static func createFile(from bytes: [UInt8]?) throws -> [String: Any] {
		var post = try Post(from: bytes)
		
		guard let url = URL(string: "\(apiContentRoot)/files_put/auto\(post.cloudPath)?overwrite") else {
			throw "Couldn't create url from \(post.cloudPath)."
		}
		
		let group = DispatchGroup()
		var request = url.dropboxAuthenticatedRequest()
		request.httpMethod = "PUT"
		request.httpBody = post.fileData
		request.setContentType(to: .plain)
		
		group.enter()
		
		var failureResponse: [String: Any] = [:]
		
		session.dataTask(with: request) { (data, response, err) in
			guard
				let data = data,
				let rawJSON = try? JSONSerialization.jsonObject(
					with: data,
					options: .allowFragments),
				let JSON = rawJSON as? [String: Any]
			else { return failureResponse = ["error": "Could not decode data."] }
			
			if let _ = JSON["error"] as? String {
				return failureResponse = JSON
			}
			
			guard
				JSON["error"] == nil,
				let dbPath = JSON["path"] as? String,
				dbPath == post.cloudPath
				else { return failureResponse = JSON }
			
			post.saveOrUpdate()
			group.leave()
		}.resume()
		
		_ = group.wait(timeout: DispatchTime(secondsFromNow: 20))
		
		if let singleError = failureResponse["error"] as? String, failureResponse.count == 1 {
			throw singleError
		}
		
		return failureResponse
	}

	private static func getPostsFolder(completion: @escaping ([String: Any]) -> Void) {
		guard let url = URL(string: "\(apiRoot)/metadata/auto/posts/") else { return }
		
		let request = url.dropboxAuthenticatedRequest()
		
		session.dataTask(with: request) { (responseData, response, error) in
			guard
				let data = responseData,
				let rawJSON = try? JSONSerialization.jsonObject(
					with: data,
					options: .allowFragments
				),
				let json = rawJSON as? [String: Any]
			else {
				guard
					let d = responseData,
					case let jay = Jay(),
					let object = try? jay.anyJsonFromData(d.array)
				else { return completion(["error": "Empty response."]) }

				return completion(["error": object])
			}
			
			completion(json)
		}.resume()
	}
	
	private static func fetchFile(at path: String, completion: @escaping (String?) -> Void) {
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
	
}
