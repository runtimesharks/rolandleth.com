//
// Created by Roland Leth on 17/05/2018.
// 
//

import Foundation
import Vapor

struct MicropubController {
	
	static func micropub(with request: Request) throws -> ResponseRepresentable {
		try Micropost(from: request).save()
		
		updateMicroBlog(with: request)
		
		return Response(status: .ok)
	}
	
	private static func updateMicroBlog(with request: Request) {
		let microFeed = "\(request.domain)microfeed".urlQueryPercentEncoded
		
		_ = try? drop.client.post("https://micro.blog/ping?url=\(microFeed)")
	}
	
}
