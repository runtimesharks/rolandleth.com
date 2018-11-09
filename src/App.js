import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import styled from "styled-components"
import { GlobalStyle } from "./components/theme/globalStyle"
import SiteHeader from "./components/navigation/SiteHeader"
import About from "./components/About"
import Theme from "./components/theme/Theme"
import Intro from "./components/Intro"
import Article from "./components/article/Article"

class App extends React.PureComponent {
	render() {
		return (
			<React.Fragment>
				<SiteHeader />
				<Content>
					<BrowserRouter>
						<Switch>
							<Route exact path="/" component={Intro} />
							<Route exact path="/about" component={About} />
							<Route exact path="/tech">
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
<pre><code class="language-swift">struct Font {\
  private enum Family: String {\
    case avenirNext\
    case proximaNova\
  }\
\
  private enum Weight: String {\
    case regular\
    case medium\
    case demiBold\
    case bold\
  }\
}\
</code></pre>\
<p>Then a method to easily create fonts:</p>\
<pre><code class="language-swift">private static func baseFont(family: Family, size: CGFloat, weight: Weight = .regular, italic: Bool = false) -&gt; UIFont {\
  let font = family.rawValue\
  let modifier = weight.rawValue + (italic ? &quot;Italic&quot; : &quot;&quot;)\
  return UIFont(name: &quot;(font)-(modifier)&quot;, size: size)!\
}\
</code></pre>\
<p>Finally, the properties:</p>\
<pre><code class="language-swift">static let barButton = Font.baseFont(family: .avenirNext, size: 16, weight: .medium)\
static let header    = Font.baseFont(family: .proximaNova, size: 18, weight: .demiBold)\
</code></pre>\
<p>If the app has only one font family, everything becomes even simpler, by removing <code>Family</code> and the related params.</p>\
',
										date: "Nov 01, 2018",
										readingTime: "2 min"
									}}
								/>
							</Route>
						</Switch>
					</BrowserRouter>
				</Content>
				<GlobalStyle />
			</React.Fragment>
		)
	}
}

const Content = styled.div`
	margin: 6em 0 0.5em 2px;

	@media screen and (max-width: ${Theme.phoneMedia}) {
		padding-top: 4em;
		padding-bottom: 0;
	}
`

export default App
