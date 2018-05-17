//
// Created by Roland Leth on 17/05/2018.
// 
//

import Vapor

struct MicropubController {
	
	static func micropub(with request: Request) throws -> ResponseRepresentable {
		try Micropost(from: request).save()
		
		return Response(status: .ok)
	}
	
}
