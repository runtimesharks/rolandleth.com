import React from "react"
import styled from "styled-components"
import "../font-awesome/css/font-awesome.min.css"
import NavigationIcon from "./NavigationIcon"
import Theme from "../theme/Theme"

const NavigationIcons = (props) => {
	return (
		<Container>
			<Button onClick={props.onSearchClick}>
				<i className="fa fa-search fa-fw" />
			</Button>
			<NavigationIcon href="/projects">
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
			<RuntimeLink href="https://runtimesharks.com">
				<div>
					<FirstHalf>{"{r"}</FirstHalf>
					<SecondHalf>s}</SecondHalf>
				</div>
			</RuntimeLink>
		</Container>
	)
}

const Container = styled.nav`
	min-height: 32px;
	grid-column: 2/3;
	font-size: 1.1em;
	display: flex;
	padding-top: 4px;
`

const RuntimeLink = styled.a`
	font-family: ${Theme.headerFont};
	font-weight: 700;
	text-align: center;
	display: inline-grid;
	align-items: center;
	padding-bottom: 4px;
	width: 42px;
`

const FirstHalf = styled.span`
	color: #00356a;
`

const SecondHalf = styled.span`
	color: #0371b8;
`

const Button = styled.button`
	font-size: inherit;
	color: inherit;
	padding: 0 0 2px;
	cursor: pointer;
	border: none;
	background: none;
	height: 21px;
	flex: 1;
	height: 100%;

	display: inline-grid;

	& > i {
		font-size: 0.85em;
		justify-self: center;
		align-self: center;
	}

	${Theme.transition("0.6s")};

	&:hover {
		color: ${Theme.linkColor};
	}
`

export default NavigationIcons
