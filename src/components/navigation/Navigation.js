import React from "react"
import styled from "styled-components"
import "../font-awesome/css/font-awesome.min.css"
import CodeMentorBanner from "./CodeMentorBanner"
import Theme from "../theme/Theme"

const Navigation = () => (
	<Container role="navigation">
		<CodeMentorBanner />
		<RuntimeLink href="https://runtimesharks.com">
			<FirstHalf>r</FirstHalf>
			<SecondHalf>s;</SecondHalf>
		</RuntimeLink>
		<HomeLink href="/">
			<i className="fa fa-home" />
		</HomeLink>
		<a href="/projects">
			<i className="fa fa-laptop fa-fw" />
		</a>
		<a href="http://github.com/rolandleth">
			<i className="fa fa-github fa-fw" />
		</a>
		{/* <a href="https://www.linkedin.com/in/rolandleth"><i className="fa fa-linkedin fa-fw"></i></a>--> */}
		<a href="/about">
			<i className="fa fa-user fa-fw" />
		</a>
		<a href="https://twitter.com/rolandleth">
			<i className="fa fa-twitter fa-fw" />
		</a>
		<a href="/feed">
			<i className="fa fa-rss fa-fw" />
		</a>
		{/* <a href="/microfeed"><i className="fa fa-rss-square fa-fw"></i></a> */}
	</Container>
)

const Container = styled.nav`
	// Because FA icons take a bit to load, and there's a height difference,
	// and all the content moves down after they load.
	min-height: 32px;
	grid-column: 1/4;
	grid-row: 3;
	justify-self: end;

	.fa {
		margin-top: 8px;
		margin-left: 14px;

		display: inline-block;
		font-size: 1.4em;
	}

	a:first-child .fa {
		margin-left: 0;
	}

	@media screen and (max-width: ${Theme.navTreshold}) {
		grid-row: 3;
		grid-column: 2/4;
		text-align: right;
	}
`

const RuntimeLink = styled.a`
	margin-left: 20px;
	font-family: "Titillium Web";
	font-weight: 700;
	font-size: 1.5em;
	position: relative;
	bottom: 2px;

	@media screen and (max-width: 486px) {
		margin-left: 40px;
	}

	@media screen and (max-width: 464px) {
		margin-left: 20px;
	}

	@media screen and (max-width: 450px) {
		margin-left: 10px;
	}
`

const HomeLink = styled.a`
	i.fa-home {
		position: relative;
		right: 4.5px;
		margin-left: 16px;
	}
`

const FirstHalf = styled.span`
	color: #00356a;
`

const SecondHalf = styled.span`
	color: #0371b8;
`

export default Navigation
