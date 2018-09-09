import React from "react"
import styled from "styled-components"
import CodeMentorBanner from "./CodeMentorBanner"

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
	text-align: right;
	margin-top: 1px;

	.fa {
		margin-top: 8px;
		margin-left: 14px;

		display: inline-block;
		font-size: 1.4em;
	}

	a:first-child .fa {
		margin-left: 0;
	}
`

const RuntimeLink = styled.a`
	margin-left: 20px;
	font-family: "Titillium Web";
	font-weight: 700;
	font-size: 1.5em;
	position: relative;
	bottom: 2px;
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
