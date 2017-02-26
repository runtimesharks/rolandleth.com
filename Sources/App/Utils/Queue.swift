//
//  Queue.swift
//  roland
//
//  Created by Roland Leth on 25.02.2017.
//
//

import Foundation

struct Queue {
	
	private let group = DispatchGroup()
	private let queue: DispatchQueue
	
	func advance() {
		group.leave()
	}
	
	func addAndWait(_ closure: @escaping () -> Void) {
		queue.async {
			self.group.enter()
			closure()
			_ = self.group.wait(timeout: DispatchTime.distantFuture)
		}
	}
	
	func add(_ closure: @escaping () -> Void) {
		queue.async {
			closure()
		}
	}
	
	init(label: String) {
		queue = DispatchQueue(label: label, attributes: [])
	}
}
