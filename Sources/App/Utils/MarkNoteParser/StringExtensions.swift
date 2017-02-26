

import Foundation

extension String {
    
    //MARK: - Linguistics
    
    /**
    Returns the langauge of a String
    
    NOTE: String has to be at least 4 characters, otherwise the method will return nil.
    
    :returns: String! Returns a string representing the langague of the string (e.g. en, fr, or und for undefined).
    */
    func detectLanguage() -> String? {
        if self.length > 4 {
            let tagger = NSLinguisticTagger(tagSchemes:[NSLinguisticTagSchemeLanguage], options: 0)
            tagger.string = self
            return tagger.tag(at: 0, scheme: NSLinguisticTagSchemeLanguage, tokenRange: nil, sentenceRange: nil)
        }
        return nil
    }
    
    /**
    Returns the script of a String
    
    :returns: String! returns a string representing the script of the String (e.g. Latn, Hans).
    */
    func detectScript() -> String? {
        if self.length > 1 {
            let tagger = NSLinguisticTagger(tagSchemes:[NSLinguisticTagSchemeScript], options: 0)
            tagger.string = self
            return tagger.tag(at: 0, scheme: NSLinguisticTagSchemeScript, tokenRange: nil, sentenceRange: nil)
        }
        return nil
    }
    
    /**
    Check the text direction of a given String.
    
    NOTE: String has to be at least 4 characters, otherwise the method will return false.
    
    :returns: Bool The Bool will return true if the string was writting in a right to left langague (e.g. Arabic, Hebrew)
    
    */
    var isRightToLeft : Bool {
        let language = self.detectLanguage()
        return (language == "ar" || language == "he")
    }
    
    
    //MARK: - Usablity & Social
    
    /**
    Check that a String is only made of white spaces, and new line characters.
    
    :returns: Bool
    */
    func isOnlyEmptySpacesAndNewLineCharacters() -> Bool {
        return self.trimmingCharacters(in: NSCharacterSet.whitespacesAndNewlines).length == 0
    }
    
    
    
	
    /**
    :returns: Base64 encoded string
    */
    func encodeToBase64Encoding() -> String {
        let utf8str = self.data(using: String.Encoding.utf8, allowLossyConversion: false)!
        return utf8str.base64EncodedString(options: .lineLength64Characters)
    }
    
    /**
    :returns: Decoded Base64 string
    */
    func decodeFromBase64Encoding() -> String {
        /*let base64data = NSData(base64EncodedString: self, options: NSDataBase64DecodingOptions.IgnoreUnknownCharacters)
        return NSString(data: base64data!, encoding: NSUTF8StringEncoding)! as String*/
        /*let base64Decoded = NSData(base64EncodedString: self, options:   NSDataBase64DecodingOptions(rawValue: 0))
        .map({ NSString(data: $0, encoding: NSUTF8StringEncoding) })
        return base64Decoded as! String*/
        
        let decodedData = NSData(base64Encoded: self, options: NSData.Base64DecodingOptions(rawValue: 0))
        return NSString(data: decodedData! as Data, encoding: String.Encoding.utf8.rawValue)! as String
        
    }
    
    func contains (substring:String)->Bool{
        return self.range(of: substring) != nil
    }
    
    func substring(begin:Int, end:Int)->String{
        let range:NSRange = NSMakeRange(begin, end - begin + 1 )
        return self[range]
    }
    
    
    func stringByDecodingURLFormat() ->String {
        return self.replacingOccurrences(of: "+", with: " ", options: .literal)
            .removingPercentEncoding!
    }
    
    func toBool() -> Bool? {
        switch self {
        case "True", "true", "yes", "1":
            return true
        case "False", "false", "no", "0":
            return false
        default:
            return nil
        }
    }
    
    func trim() -> String{
		return self.trimmingCharacters(in: NSCharacterSet.whitespaces)
        
    }
    
    func indexOf(_ toFind: String) -> Int{
        
        if let range = self.range(of: toFind){
            return self.distance(from: startIndex, to: range.lowerBound)
        } else {
            return -1
        }
    }
    
    func contains3PlusandOnlyChars(char: String) -> Bool{
        return self.length >= 3
            && self.indexOf(char) == 0
            && self.replacingOccurrences(of: char, with: "", options: NSString.CompareOptions.literal, range: nil).length == 0
    }
    
    func replaceAll(_ target: String, toStr: String) -> String{
        return self.replacingOccurrences(of: target, with: toStr, options: NSString.CompareOptions.literal, range: nil)
    }
}
