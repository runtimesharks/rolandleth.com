//
//  DownloadsController.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

import HTTP
import Vapor

struct DownloadsController {
	
	static func process(with request: Request) throws -> ResponseRepresentable {
		let path = try request.parameters.next(String.self)
		
		let asset: String = {
			switch path {
			case "privacy-policy.md": return "Roland Leth - Privacy Policy.md"
			case "resume.pdf":
				#if os(Linux)
					return "Roland Leth - Resume.pdf"
				#else
					return "Roland Leth - Résumé.pdf"
				#endif
			case "europass.pdf": return "Roland Leth - Europass.pdf"
			case "carminder-press-kit.zip": return "Carminder Press Kit.zip"
			case "expenses-planner-press-kit.zip": return "Expenses Planner Press Kit.zip"
			default: return ""
			}
		}()
		
		guard !asset.isEmpty else { throw Abort.notFound }
		
		return Response(redirect: "/files/\(asset)")
	}
	
}
