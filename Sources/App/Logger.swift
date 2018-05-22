//
// Created by Roland Leth on 21/05/2018.
// 
//

import Vapor
import Foundation

final class Logger: LogProtocol {
	
	private let workDir: String
	var enabled: [LogLevel] = LogLevel.all
	
	func log(_ level: LogLevel, message: String, file: String, function: String, line: Int) {
		guard enabled.contains(level) else { return }
		
		let filename = file
			.replacingOccurrences(of: ".swift", with: "")
			.components(separatedBy: "/")
			.last ?? ""
		
		var log = "\(Date()): \(filename) [\(line)] - \(message)"
		
		if level == .warning || level == .fatal || level == .error {
			log = "\(level.description.uppercased()) -- " + log
		}
		
		let logPath = workDir + "/logs.log"
		let contents = FileManager.default.contents(atPath: logPath) ?? Data()
		var history = String(data: contents, encoding: .utf8) ?? ""
		
		history += log + "\n"
		
		let newData = history.data(using: .utf8) ?? contents
		
		FileManager.default.createFile(atPath: logPath, contents: newData, attributes: nil)
	}
	
	
	// MARK: - Init
	
	init(workDir: String) {
		self.workDir = workDir
	}
	
}
