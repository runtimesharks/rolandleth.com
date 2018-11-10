import React from "react"
import styled from "styled-components"
import Link from "./link/Link"
import Theme from "./theme/Theme"

const Intro = () => (
	<Container>
		<Greeting>
			Hello, I'm Roland Leth. <br />
			Welcome to by blog!
		</Greeting>
		<p>
			I’m an iOS & web developer, amateur designer and entrepreneur. Lately,
			I've been fascinated more and more about the human brain, our behaviour
			and how we can improve ourselves. Naturally, the two sections of this
			blog are about:
		</p>
		<List>
			<ListItem className="tech">
				<img
					className="illustration"
					src={require("../images/developer.svg")}
					alt="A developer in front of 6 monitors"
				/>
				<p>
					iOS development: snippets, walkthroughs, tips and tricks, stuff
					that I struggled with and links to interesting stuff I find
					around the web. From time to time I might write about JS too, and
					if I find an interesting or helpful tool, I will write about that
					as well.
				</p>
			</ListItem>
			<ListItem className="life">
				<p>
					My journey of self-improvement and the lessons I've learned — on
					my own, or from what I read. The posts will be about habits,
					identity change, motivation, productivity and self-improvement.
					I'm pretty excited to share everything with you!
				</p>
				<img
					className="illustration"
					src={require("../images/progress.svg")}
					alt="Woman moving gears"
				/>
			</ListItem>
		</List>
		<p>
			Most of the motivational videos or articles you can find online are by
			or about successful people. If, at times, you've thought that "of
			course, they're rich/successful, it's easy for them", then you're not
			alone; I have as well. I'm not wealthy, nor famous and this is one of
			the reasons I started this section: to give confidence to other people
			that this kind of change <strong>is</strong> possible by everyone.
		</p>
		<LastParagraph>
			If I can be of help or you just want to say hi, you can drop me an
			email at{" "}
			<Link
				href="mailto:hi@rolandleth.com"
				title="Shoot me an email"
				text="hi@rolandleth.com"
			/>
			, or find me on Twitter{" "}
			<Link
				href="https://twitter.com/rolandleth"
				title="Roland Leth's Twitter"
				text="@rolandleth"
			/>
			. You can find out more about me on{" "}
			<Link href="/about" title="About Roland Leth" text="my about page" />.
		</LastParagraph>
	</Container>
)

const Container = styled.div`
	img.illustration {
		box-shadow: none;
		max-width: 300px;
	}

	@media screen and (max-width: ${Theme.navTreshold1}) {
		img.illustration {
			max-width: 200px;
		}
	}

	@media screen and (max-width: 600px) {
		.life {
			& > img.illustration {
				max-width: 300px;
				grid-row: 1;
			}

			& > p {
				margin-bottom: 0;
			}
		}
	}
`

const Greeting = styled.h1``

const List = styled.div`
	padding: 60px 0 40px;
	display: grid;
	grid-gap: 80px;

	@media screen and (max-width: ${Theme.navTreshold1}) {
		padding: 20px 0 0;
		grid-gap: 40px;
	}

	@media screen and (max-width: 600px) {
		grid-gap: 20px;
	}
`

const ListItem = styled.div`
	display: grid;
	justify-items: center;
	align-items: center;
	grid-template-columns: auto auto;
	grid-gap: 60px;

	@media screen and (max-width: ${Theme.navTreshold1}) {
		grid-gap: 40px;
	}

	@media screen and (max-width: 600px) {
		grid-template-columns: auto;
		grid-gap: 0;
	}
`

const LastParagraph = styled.p`
	padding-top: 20px;
`

export default Intro
