import React from "react"
import styled from "styled-components"
import Article from "../article/Article"

const Tech = () => {
	return (
		<Container>
			<Article
				post={{
					title: "Testing",
					link: "/testing",
					rawBody:
						'In a [previous post][1] I was writing about improving working with `UIFont` and now I’d like to take it one step further in regards with having a quick and easy way to set fonts, if you use a single typeface (font family):\
\
												```swift\
extension UIFont {\
\
   static func regular(_ size: CGFloat) -> UIFont {\
      return .systemFont(ofSize: size, weight: .regular) // Or any other font.\
   }\
\
   static func medium(_ size: CGFloat) -> UIFont {\
      return .systemFont(ofSize: size, weight: .medium)\
   }\
\
}\
```\
\
This might not seem much, or maybe I’m just lazy, but I find it easier to write and read\
\
								```swift\
								let nameLabel = UILabel()\
								nameLabel.font = .regular(15)\
								```\
\
								than\
\
								```swift\
								let nameLabel = UILabel()\
								nameLabel.font = .systemFont(ofSize: size, weight: .regular)\
								```\
\
								[1]:	/improving-uifont-workflow "Improving UIFont workflow"',
					body:
						'<p>Usually an app has fonts with well defined purposes. So why not let <code>enums</code> make our lives easier, a little bit? First, a couple of them, to define our font families and weights:</p>\
<pre><code class="language-swift">struct Font {\n\
  private enum Family: String {\n\
    case avenirNext\n\
    case proximaNova\n\
  }\n\
\n\
  private enum Weight: String {\n\
    case regular\n\
    case medium\n\
    case demiBold\n\
    case bold\n\
  }\n\
}\n\
</code></pre>\
<p>Then a method to easily create fonts:</p>\
<pre><code class="language-swift">private static func baseFont(family: Family, size: CGFloat, weight: Weight = .regular, italic: Bool = false) -&gt; UIFont {\n\
  let font = family.rawValue\n\
  let modifier = weight.rawValue + (italic ? &quot;Italic&quot; : &quot;&quot;)\n\
  return UIFont(name: &quot;(font)-(modifier)&quot;, size: size)!\n\
}\n\
</code></pre>\n\
<p>Finally, the properties:</p>\n\
<pre><code class="language-swift">static let barButton = Font.baseFont(family: .avenirNext, size: 16, weight: .medium)\n\
static let header    = Font.baseFont(family: .proximaNova, size: 18, weight: .demiBold)\n\
</code></pre>\
<p>If the app has only one font family, everything becomes even simpler, by removing <code>Family</code> and the related params.</p>\
',
					date: "Nov 01, 2018",
					readingTime: "2 min"
				}}
			/>
		</Container>
	)
}

const Container = styled.div``
const Greeting = styled.h1``

export default Tech
