//
// Created by Roland Leth on 17/05/2018.
// 
//

import Foundation
import Vapor

struct MicropubController {
	
	static func micropub(with request: Request) throws -> ResponseRepresentable {
		try Micropost(from: request).save()
		
		updateMicroBlog()
		
		return Response(status: .ok)
	}
	
	private static func updateMicroBlog() {
		let microFeed = "https://rolandleth.com/microfeed".urlQueryPercentEncoded
		
		_ = try? drop.client.post("https://micro.blog/ping?url=\(microFeed)")
	}
	
}
