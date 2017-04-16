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
	
	static func process(with request: Request, path: String) throws -> ResponseRepresentable {
//		headers["Content-Type"] = "application/pdf; filename=\(fileName)"
//		headers["Content-Disposition"] = "inline; filename=\(fileName)"
		
		let asset: String = {
			switch path {
			case "privacy-policy.md": return "Roland Leth - Privacy Policy.md"
			case "resume.pdf": return "Roland Leth - Résumé.pdf"
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
