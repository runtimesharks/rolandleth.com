import React from "react"
import styled from "styled-components"

const About = () => (
	<React.Fragment>
		<Image src={require("../images/misc/mypic.jpg")} alt="My Picture" />
		<p>
			Hello, my name is Roland; I’m an iOS developer, an amateur web
			developer & designer, and I sometimes tinker with JS and Ruby. More
			information can be found in{" "}
			<a href="/downloads/resume.pdf">my résumé</a> and on my{" "}
			<a href="http://careers.stackoverflow.com/rolandleth">
				Stack Overflow Careers
			</a>{" "}
			profile.
		</p>
		<p>
			If I could be of help or you just want to say hi, you can drop me an
			email at <a href="mailto:hi@rolandleth.com">hi@rolandleth.com</a>, or
			find me on Twitter{" "}
			<a href="https://twitter.com/rolandleth">@rolandleth</a>.
		</p>
		<p>
			I’m mostly writing about iOS development: snippets, walkthroughs, tips
			and tricks, stuff that I struggled with and links to interesting stuff
			I find around the web. From time to time I might write about JS and
			Ruby too, and if I find an interesting or helpful app, I will write
			about that, as well.
		</p>
		<p>
			The blog is now created with <a href="https://swift.org">Swift</a> &{" "}
			<a href="https://vapor.codes">Vapor</a> (previously with{" "}
			<a href="http://www.nodejs.org/">Node.js</a> and{" "}
			<a href="http://www.sinatrarb.com/">Sinatra</a>) and it's hosted on{" "}
			<a href="http://heroku.com">Heroku</a>. It’s written using{" "}
			<a href="http://daringfireball.net/projects/markdown/">Markdown</a>,
			with the help of{" "}
			<a href="http://lightpaper.42squares.in">LightPaper</a> and{" "}
			<a href="http://omz-software.com/editorial/">Editorial</a>.
		</p>
	</React.Fragment>
)

const Image = styled.img`
	float: left;
	margin: 6px 1em 0 0;
`

export default About
