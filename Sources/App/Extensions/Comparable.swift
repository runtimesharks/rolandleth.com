//
//  Comparable.swift
//  roland
//
//  Created by Roland Leth on 22.02.2017.
//
//

func <<T : Comparable>(lhs: T?, rhs: T?) -> Bool {
	switch (lhs, rhs) {
	case let (l?, r?): return l < r
	case (nil, _?): return true
	default: return false
	}
}

func ><T : Comparable>(lhs: T?, rhs: T?) -> Bool {
	switch (lhs, rhs) {
	case let (l?, r?): return l > r
	default: return rhs < lhs
	}
}

func >=<T : Comparable>(lhs: T?, rhs: T?) -> Bool {
	switch (lhs, rhs) {
	case let (l?, r?): return l >= r
	default: return !(lhs < rhs)
	}
}

func <=<T : Comparable>(lhs: T?, rhs: T?) -> Bool {
	switch (lhs, rhs) {
	case let (l?, r?): return l <= r
	default: return !(rhs < lhs)
	}
}
