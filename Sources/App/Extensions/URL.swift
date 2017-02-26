//
//  URL.swift
//  roland
//
//  Created by Roland Leth on 24.02.2017.
//
//

import Foundation

extension URL {
	
	func dropboxAuthenticatedRequest() -> URLRequest {
		var request = URLRequest(url: self)
		request.setValue("Bearer \(drop.dropboxKey)", forHTTPHeaderField: "Authorization")
		return request
	}
	
}
