import React from "react"
import styled from "styled-components"
import "../font-awesome/css/font-awesome.min.css"
import CodeMentorBanner from "./CodeMentorBanner"
import NavigationIcon from "./NavigationIcon"
import Theme from "../theme/Theme"

const Navigation = () => (
	<Container role="navigation">
		<CodeMentorBanner />
		<RuntimeLink href="https://runtimesharks.com">
			<FirstHalf>{"{r"}</FirstHalf>
			<SecondHalf>s}</SecondHalf>
		</RuntimeLink>
		<NavigationIcon className="projects" href="/projects">
			<i className="fa fa-laptop fa-fw" />
		</NavigationIcon>
		<NavigationIcon className="github" href="http://github.com/rolandleth">
			<i className="fa fa-github fa-fw" />
		</NavigationIcon>
		<NavigationIcon href="https://twitter.com/rolandleth">
			<i className="fa fa-twitter fa-fw" />
		</NavigationIcon>
		<NavigationIcon href="/feed">
			<i className="fa fa-rss fa-fw" />
		</NavigationIcon>
		<NavigationIcon className="user" href="/about">
			<i className="fa fa-user fa-fw" />
		</NavigationIcon>
		<NavigationIcon href="/about">
			<img
				className="patreon"
				src={require("../../images/misc/patreon.png")}
				alt="Support me on Patreon"
			/>
		</NavigationIcon>
	</Container>
)

const Container = styled.nav`
	// Because FA icons take a bit to load, and there's a height difference,
	// and all the content moves down after they load.
	min-height: 32px;
	grid-column: 1/4;
	grid-row: 3;
	justify-self: end;
	margin-top: 8px;

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
	margin-left: 15px;
	font-family: ${Theme.headerFont};
	font-weight: 700;
	font-size: 1.5em;
	position: relative;
	bottom: 3px;

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

const FirstHalf = styled.span`
	color: #00356a;
`

const SecondHalf = styled.span`
	color: #0371b8;
`

export default Navigation
