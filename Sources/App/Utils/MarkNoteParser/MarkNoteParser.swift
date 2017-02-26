/**
* MarknoteParser- a markdown parser
* Copyright (c) 2015, MarkNote. (MIT Licensed)
* https://github.com/marknote/MarknoteParser
*/

import Foundation

public class MarkNoteParser: NSObject {
	
	//var nOldBulletLevel = 0
	var nCurrentBulletLevel = 0
	var bInTable = false
	var output = ""
	var isInParagraph = false
	var isAfterEmptyLine = false
	var tableColsAlignment = [String]()
	let headerChar:Character = "#"
	var blockEndTags = [String]()
	var isCurrentLineNeedBr = true
	var arrReferenceInfo = [ReferenceDefinition]()
	var arrReferenceUsage = [ReferenceUsageInfo]()
	
	public static func toHtml(_ input:String) -> String{
		let instance = MarkNoteParser()
		instance.output = ""
		instance.parse(input: input)
		return instance.output
	}
	
	
	func parse (input:String){
		proceedNoHtml(input: input)
		proceedReference()
	}
	
	func proceedReference(){
		for refer in self.arrReferenceUsage {
			let hitted = arrReferenceInfo.filter{ $0.key.lowercased() == refer.key.lowercased() }
			if hitted.count > 0 {
				let found = hitted[0]
				var actual = ""
				switch refer.type {
				case .Link:
					if found.url._title.length > 0 {
						actual = "<a href=\"\(found.url)\" title=\"\(found.url._title)\">\(refer.title)</a>"
					} else {
						actual = "<a href=\"\(found.url)\">\(refer.title)</a>"
					}
				case .Image:
					if found.url._title.length > 0 {
						actual = "<img src=\"\(found.url)\" alt=\"\(refer.title)\" title=\"\(found.url._title)\"/>"
						
					} else {
						actual = "<img src=\"\(found.url)\" alt=\"\(refer.title)\"/>"
					}
				}
				output = output.replaceAll(refer.placeHolder(), toStr: actual)
			}
		}
	}
	
	
	func proceedHTMLTags(input:String){
		var currentPos = 0
		let tagBegin = input.indexOf("<")
		if tagBegin >= 0 {
			if tagBegin >= 1 {
				proceedNoHtml(input: input.substring(begin: currentPos, end: tagBegin - 1))
			}
			//currentPos = tagBegin
			if tagBegin < input.length - 1 {
				var left = input.substring(begin: tagBegin, end: input.length - 1)
				var endTag = left.indexOf(">")
				if endTag > 0 {
					// found
					if left[endTag - 1] == "/" {
						//auto close: <XXX />
						self.output += left.substring(to: left.index(left.startIndex, offsetBy: endTag + 1))
						if endTag < left.length - 2 {
							proceedHTMLTags(input: left.substring(from: left.index(left.startIndex, offsetBy: endTag + 1)))
						}
					} else {
						// there is a close tag
						currentPos = endTag
						if endTag <= left.length - 1 {
							left = left.substring(from: left.index(left.startIndex, offsetBy: endTag + 1))
							endTag = left.indexOf(">")
							if endTag > 0 {
								self.output += input.substring(begin: tagBegin, end: tagBegin + endTag + currentPos + 1) //+ left.substringToIndex(advance(left.startIndex,endTag ))
								if endTag < left.length - 1 {
									left = left.substring(from: left.index(left.startIndex, offsetBy: endTag + 1))
									proceedHTMLTags(input: left)
									return
								}
							} else {
								proceedNoHtml(input: input)
								return
							}
						} else {
							output += input
							return
						}
					}
				}else {
					// not found
					proceedNoHtml(input: left)
				}
			}
		}else {
			proceedNoHtml(input: input)
		}
	}
	func proceedNoHtml (input:String){
		let preProceeded = input.replaceAll("\r\n", toStr: "\n").replaceAll("\n", toStr:"  \n")
		
		
		//let lines = split(preProceeded){$0 == "\n"}
		let lines = input.components(separatedBy: "\n")
		var isInCodeBlock:Bool = false
		
		
		//for rawline in lines {
		var i = 0
		while i < lines.count {
			defer { i += 1 }
			isCurrentLineNeedBr = true
			
			var line = lines[i]
			if !isInCodeBlock {
				line = line.trim()
			}
			
			if isInCodeBlock {
				if line.indexOf("```") >= 0 {
					isInCodeBlock = false
					output += "</code></pre>\n"
					isCurrentLineNeedBr = false
					continue
				}else {
					output += line
						.replaceAll("&", toStr:"&amp;")
						.replaceAll("\"", toStr:"&quot;")
						.replaceAll("<", toStr:"&lt;")
						.replaceAll(">", toStr:"&gt;")
					
					output += "\n"
				}
			} else if bInTable && line.length > 0 {
				handleTableLine(rawline: line, isHead:false)
			} else {
				// not in block
				if  line.length == 0 {
					// empty line
					closeTags()
					closeParagraph()
					closeTable()
					isAfterEmptyLine = true
					isCurrentLineNeedBr = false
					continue
				}else {
					isAfterEmptyLine = false
				}
				
				if line.indexOf("- ") == 0
					|| line.indexOf("* ") == 0
					|| line.indexOf("+ ") == 0 {
					if self.nCurrentBulletLevel == 0 {
						output += "<ul>\n"
						blockEndTags.append("</ul>\n")
						self.nCurrentBulletLevel = 1
						isCurrentLineNeedBr = false
						
					}
					output += "<li>"
					let newline = line.substring(begin: "- ".length, end: line.length - 1)
					handleLine(newline, skipParagraph: true)
					output += "</li>\n"
					continue
				} else {
					self.nCurrentBulletLevel = 0
				}
				
				if  line.indexOf("```") == 0 {
					isInCodeBlock = true
					var cssClass = "no-highlight"
					if line.length > "```".length {
						//prettyprint javascript prettyprinted
						let remaining = line.substring(from: line.index(line.startIndex, offsetBy: "```".length))
						cssClass = "language-\(remaining)"
					}
					output += "<pre><code class=\"\(cssClass)\">"
					continue // ignor current line
				}
				
				if i + 1 <= lines.count - 1 {
					let nextLine = lines[i + 1].trim()
					if nextLine.contains3PlusandOnlyChars(char: "="){
						output += "<h1>" + line + "</h1>\n"
						i += 1
						continue
					} else if nextLine.contains3PlusandOnlyChars(char: "-"){
						output += "<h2>" + line + "</h2>\n"
						i += 1
						continue
					} else if  nextLine.indexOf("|") >= 0
						&& line.indexOf("|") >= 0
						&& nextLine.replaceAll("|", toStr: "").replaceAll("-", toStr: "").replaceAll(":", toStr: "").replaceAll(" ", toStr: "").length == 0
					{
						
						beginTable(alignmentLine: nextLine)
						handleTableLine(rawline: line, isHead:true)
						i += 1
						continue
					}
				}
				
				
				handleLine(line)
				if isInParagraph {
					isCurrentLineNeedBr = false
					closeParagraph()
				}
				else if isCurrentLineNeedBr
					&& lines[i].length >= 2
					&& lines[i].substring(from: lines[i].index(lines[i].startIndex, offsetBy: lines[i].length - 2)) == "  " {
					output += "<br/>"
				}
			}
		}//end for
		closeTags()
		closeParagraph()
		
	}
	
	func handleTableLine(rawline:String, isHead:Bool) {
		
		let cols = rawline.characters.split{$0 == "|"}.map { String($0) }
		output += "<tr>"
		var i = 0
		
		for col in cols {
			let colAlign = self.tableColsAlignment[i]
			if isHead {
				output += colAlign.length > 0 ? "<th \(colAlign)>" : "<th>"
				parseInLine(line: col)
				output += "</th>"
			} else {
				output += colAlign.length > 0 ? "<td \(colAlign)>" : "<td>"
				parseInLine(line: col)
				output += "</td>"
			}
			i += 1
		}
		output += "</tr>"
	}
	
	func beginTable(alignmentLine: String){
		if !bInTable {
			bInTable = true
			output += "<table>"
			self.tableColsAlignment.removeAll(keepingCapacity: false)
			let arr = alignmentLine.trim().components(separatedBy: "|")
			for col in arr {
				if col.indexOf(":-") >= 0 && col.indexOf("-:") > 0 {
					self.tableColsAlignment.append("style=\"text-align: center;\"")
				}else if col.indexOf("-:") > 0{
					self.tableColsAlignment.append("style=\"text-align: right;\"")
				}else {
					self.tableColsAlignment.append("")
				}
			}
		}
	}
	func closeTable(){
		if bInTable {
			bInTable = false
			output += "</table>"
		}
	}
	func closeTags(){
		for endTag in blockEndTags.reversed() {
			output += endTag
			//blockEndTags.removeAtIndex(i)
		}
		blockEndTags.removeAll(keepingCapacity: false)
	}
	
	func closeParagraph () {
		if isInParagraph {
			isInParagraph = false
			output += "</p>\n"
		}
	}
	
	func beginParagraph(){
		if !isInParagraph {
			isInParagraph = true
			output += "<p>"
		}
	}
	
	
	
	func calculateHeadLevel(line:String)->Int{
		var nFindHead = 0
		var pos: String.Index = line.startIndex
		for i in (0..<min(7, line.characters.count)) {
			pos = line.index(line.startIndex, offsetBy: i)
			if line[pos] == headerChar  {
				nFindHead = i + 1
			} else {
				break;
			}
		}
		return nFindHead
	}
	
	func handleLine(_ rawline:String, skipParagraph: Bool = false) {
		
		if rawline.contains3PlusandOnlyChars(char: "-")
			|| rawline.contains3PlusandOnlyChars(char: "*")
			|| rawline.contains3PlusandOnlyChars(char: "_"){
			closeParagraph()
			output += "<hr>\n"
			return
		}
		var line = rawline
		var endTags = [String]()
		
		var pos: String.Index = line.startIndex
		
		if line[0] == ">" {
			let tag = "blockquote"
			if blockEndTags.index(of: "</\(tag)>") == nil {
				output += "<\(tag)>"
				blockEndTags.append("</\(tag)>")
			}
			line = line.substring(from: line.index(line.startIndex, offsetBy: ">".length))
		}
		
		let nFindHead = calculateHeadLevel(line: line)
		if (nFindHead > 0) {
			isCurrentLineNeedBr = false
			
			output  += "<h\(nFindHead)>"
			endTags.append("</h\(nFindHead)>")
			pos = line.index(line.startIndex, offsetBy: nFindHead)
		} else if !skipParagraph {
			beginParagraph()
		}
		
		//line = this.handleImage(line, sb)
		
		let remaining = line.substring(from: pos).trim()
		parseInLine(line: remaining)
		//output += "\n"
		
		for endTag in endTags.reversed() {
			output += endTag
		}
		
		//output += "\n"
		
	}
	
	func parseInLine(line: String) {
		let len = line.length
		let start = line.startIndex
		var i = 0
		while i < len {
			defer { i += 1 }
			let ch:Character = line[line.index(start, offsetBy: i)]
			
			switch ch {
			case "*","_","~":
				if (i + 1 > len - 1) {
					output.append(ch)
					return
				}
				var tag: String = {
					switch ch {
					case "~": return "del"
					default: return "em"
					}
				}()
				
				let s = line.index(start, offsetBy: i)
				let e = line.index(s, offsetBy: 2)
				
				if line[s..<e] == "\(ch)\(ch)" {
					if ch == "*" {
						tag = "strong"
					}
					i += 1
				}
				
				if let tagIndex = blockEndTags.index(of: "</\(tag)>") {
					output += "</\(tag)>"
					blockEndTags.remove(at: tagIndex)
				}
				else {
					output += "<\(tag)>"
					blockEndTags.append("</\(tag)>")
				}
				
//				if line[line.index(start, offsetBy: i + 1)] == ch {
//					//possible **
//					if let strongIndex = blockEndTags.index(of: "</strong>") {
//						output += "</strong>"
//						blockEndTags.remove(at: strongIndex)
//					}
//					else {
//						output += "<strong>"
//						blockEndTags.append("</strong>")
//					}
//					i += 1 // To skip over the second * or _
////					let remaining = line.substring(from: line.index(start, offsetBy: i + 2))
////					i += scanClosedChar(MarkNoteParser.charArray(ch, len: 2),inStr: remaining,tag: strong) + 1
//				} else {
//					if let emIndex = blockEndTags.index(of: "</em>") {
//						output += "</em>"
//						blockEndTags.remove(at: emIndex)
//					}
//					else {
//						output += "<em>"
//						blockEndTags.append("</em>")
//					}
////					let remaining = line.substring(from: line.index(start, offsetBy: i + 1))
////					i += 1
////					i += scanClosedChar("\(ch)",inStr: remaining,tag: "em")
//				}
			case "`":
				let remaining = line.substring(from: line.index(start, offsetBy: i + 1))
				i += scanClosedChar("`",inStr: remaining,tag: "code")
				isCurrentLineNeedBr = false
				
			case "!":
				if i >= line.length - 1 || line[line.index(start, offsetBy: i + 1)] != "[" {
					output.append(ch)
					continue
				}
				i += 1
				let remaining = line.substring(from: line.index(start, offsetBy: i + 1))
				let posArray = MarkNoteParser.detectPositions(["]","(",")"],inStr: remaining)
				if posArray.count == 3 {
					let img = ImageTag()
					img.alt = line.substring(begin: i + 1, end: i + 1 + posArray[0] - 1)
					img.url = URLTag(url: line.substring( begin: i + 1 + posArray[1] + 1, end: i + 1 + posArray[2] - 1)
					)
					output += img.toHtml()
					i +=  posArray[2] + 1
				}else {
					// check image reference defintion
					let posArray2 = MarkNoteParser.detectPositions(["]","[","]"],inStr: remaining)
					if posArray2.count == 3 {
						//is reference usage
						let title = line.substring(begin: i + 1, end: i + 1 + posArray2[0] - 1)
						let url = line.substring( begin: i + 1 + posArray2[1] + 1, end: i + 1 + posArray2[2] - 1)
						let refer = ReferenceUsageInfo()
						refer.type = .Image
						refer.key = url.lowercased()
						refer.title = title
						self.arrReferenceUsage.append(refer)
						output += refer.placeHolder()
						i += posArray2[2] + 1 + 1
					}
				}
				
			case "[":
				let remaining = line.substring(from: line.index(start, offsetBy: i + 1))
				let posArray = MarkNoteParser.detectPositions(["]","(",")"],inStr: remaining)
				if posArray.count == 3 {
					let link = LinkTag()
					link.text = line.substring(begin: i + 1, end: i + 1 + posArray[0] - 1)
					link.url = URLTag(url: line.substring(begin: i + 1 + posArray[1] + 1, end: i + 1 + posArray[2] - 1))
					output += link.toHtml()
					i +=  posArray[2] + 1
				}else {
					// check reference defintion
					let pos = remaining.indexOf("]:")
					if pos > 0 && pos < remaining.length - "]:".length {
						// is reference definition
						let info = ReferenceDefinition()
						info.key = remaining.substring(to: remaining.index(remaining.startIndex, offsetBy: pos))
						let remaining2 = remaining.substring(from: remaining.index(remaining.startIndex, offsetBy: pos + "]:".length))
						info.url = URLTag(url: remaining2)
						self.arrReferenceInfo.append(info)
						i += pos + "]:".length + remaining2.length
					} else {
						let posArray2 = MarkNoteParser.detectPositions(["]","[","]"],inStr: remaining)
						if posArray2.count == 3 {
							//is reference usage
							let title = line.substring(begin: i + 1, end: i + 1 + posArray2[0] - 1)
							let url = line.substring( begin: i + 1 + posArray2[1] + 1, end: i + 1 + posArray2[2] - 1)
							let refer = ReferenceUsageInfo()
							refer.type = .Link
							refer.key = url.lowercased()
							refer.title = title
							self.arrReferenceUsage.append(refer)
							output += refer.placeHolder()
							i +=  pos + posArray2[2] + 1 + 1
						}
					}
				}
			case "\"":
				output += "&quot;"
			default:
				//do nothing
				output.append(ch)
			}
		}
	}
	
	public static func charArray(_
		ch:Character, len:Int)->String{
		var str = ""
		for _ in 0  ..< len  {
			str.append(ch)
		}
		return str
	}
	
	public static func detectPositions(_ toFind:[String],inStr:String )->[Int]{
		var posArray = [Int]()
		let count = toFind.count
		var lastPos = 0
		for i in 0 ..< count  {
			let pos = inStr.substring(from: inStr.index(inStr.startIndex, offsetBy: lastPos)).indexOf(toFind[i])
			lastPos += pos
			if pos >= 0 {
				posArray.append(lastPos)
			}else {
				return posArray
			}
		}
		return posArray
	}
	
	func  scanClosedChar(_ ch:String, inStr:String,tag:String) -> Int {
		let pos = inStr.indexOf(ch)
		if pos > 0 {
			output += "<\(tag)>" + inStr.substring(to: inStr.index(inStr.startIndex, offsetBy: pos)) + "</\(tag)>"
		} else {
			output += ch
		}
		return pos + ch.length
	}
	public class func splitStringWithMidSpace(input: String) -> [String]{
		var array = [String]()
		let trimmed = input.trim()
		let pos = trimmed.indexOf(" ")
		if pos > 0 {
			array.append(trimmed.substring(to: trimmed.index(trimmed.startIndex, offsetBy: pos)))
			array.append(trimmed.substring(from: trimmed.index(trimmed.startIndex, offsetBy: pos + 1)))
		} else {
			array.append(trimmed)
		}
		return array
	}
	
}
enum ReferenceType{
	case Link
	case Image
}

class URLTag: NSObject {
	var _url = ""
	var _title = ""
	init(url:String){
		let trimmed = url.trim()
		//let posSpace = trimmed.indexOf(" ")
		let arr = MarkNoteParser.splitStringWithMidSpace(input: trimmed)
		if arr.count > 1 {
			_url = arr[0].lowercased()
			_title = arr[1].replaceAll("\"", toStr: "")
		} else {
			_url = arr[0].lowercased()
		}
		
	}
	override var description: String {
		return _url
	}
}

class LinkTag {
	var text = ""
	var url = URLTag(url:"")
	func toHtml()-> String{
		if url._title.length > 0 {
			return "<a href=\"\(url._url)\" title=\"\(url._title)\">" + text + "</a>"
		} else {
			return "<a href=\"\(url._url)\">" + text + "</a>"
		}
	}
}

class ImageTag{
	
	var alt = ""
	var url = URLTag(url:"")
	func toHtml()-> String{
		if url._title.length > 0 {
			return "<img=\"\(url._url)\" alt=\"\(alt)\" title=\"\(url._title)\" />"
		} else {
			return "<img src=\"\(url._url)\" alt=\"\(alt)\" />"
		}
	}
}

class ReferenceDefinition {
	var key = ""
	var url = URLTag(url:"")
}
class ReferenceUsageInfo{
	var title = ""
	var key = ""
	var type = ReferenceType.Link
	func placeHolder() -> String{
		return "ReferenceUsageInfo\(key)\(title)"
	}
}
