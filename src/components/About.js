import React from "react"
import styled from "styled-components"
import Theme from "./theme/Theme"

const About = () => (
	<Container>
		<Image src={require("../images/misc/mypic.jpg")} alt="My Picture" />
		<FirstParagraph>
			Hello, my name is Roland; I’m an iOS developer, JS enthusiast, web
			developer & amateur designer. If you'd like to know more, you can check
			out <a href="/downloads/resume.pdf">my résumé</a>.
		</FirstParagraph>
		<p>
			I’m writing about iOS development: snippets, walkthroughs, tips and
			tricks, stuff that I struggled with and links to interesting stuff I
			find around the web. From time to time I might write about JS too, and
			if I find an interesting or helpful tool, I will write about that as
			well.
		</p>
		<p>
			I've recently opened a new section on the blog, called "Life". Here I'm
			writing about my journey of self-improvement and the lessons I've
			learned — on my own, or from what I read. The topics will be about
			habits, identity change, motivation, productivity and self-improvement.
			I'm pretty excited to share everything with you!
		</p>
		<p>
			If I can be of help or you just want to say hi, you can drop me an
			email at <a href="mailto:hi@rolandleth.com">hi@rolandleth.com</a>, or
			find me on Twitter{" "}
			<a href="https://twitter.com/rolandleth">@rolandleth</a>.
		</p>
	</Container>
)

const Container = styled.div`
	padding: 2em 0;
	border-bottom: 1px solid ${Theme.lightGray};
`

const FirstParagraph = styled.p`
	margin-top: 0;
`

const Image = styled.img`
	float: left;
	margin: 4px 1.3em 0 0;
	max-width: 200px;
`

export default About
