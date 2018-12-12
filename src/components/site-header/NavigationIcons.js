import React from "react"
import styled from "styled-components"
import Theme from "../theme/Theme"
import "../font-awesome/css/font-awesome.min.css"
import NavigationIcon from "./NavigationIcon"
import Button from "./Button"
import HoverableLink from "../link/HoverableLink"
import { Route, Switch } from "react-router-dom"

const NavigationIcons = (props) => {
	return (
		<Container>
			<Switch>
				<Route path="/:anything">
					<React.Fragment>
						<IconButton
							onClick={props.onSearchClick}
							title="Search Roland's posts"
						>
							<i className="fa fa-search fa-fw" />
						</IconButton>
						<NavigationIcon href="/" title="Roland's Leth's homepage">
							<i className="fa fa-home fa-fw" />
						</NavigationIcon>
					</React.Fragment>
				</Route>
			</Switch>
			<Switch>
				<Route path="/tech">
					<NavigationIcon
						href="https://runtimesharks.com/projects"
						title="Roland's projects"
					>
						<i className="fa fa-laptop fa-fw" />
					</NavigationIcon>
				</Route>
			</Switch>
			<Switch>
				<Route path="/tech">
					<NavigationIcon
						className="github"
						href="http://github.com/rolandleth"
						title="Roland's GitHub"
					>
						<i className="fa fa-github fa-fw" />
					</NavigationIcon>
				</Route>
			</Switch>
			<NavigationIcon
				href="https://twitter.com/rolandleth"
				title="Roland's Twitter"
			>
				<i className="fa fa-twitter fa-fw" />
			</NavigationIcon>
			<Switch>
				<Route path="/:anything">
					<NavigationIcon
						href="/tech/feed"
						title="Subscribe to Roland's feed"
					>
						<i className="fa fa-rss fa-fw" />
					</NavigationIcon>
				</Route>
			</Switch>
			<StyledRuntimeLink
				href="https://runtimesharks.com"
				title="Runtime Sharks"
			>
				<div>
					<FirstHalf>{"{r"}</FirstHalf>
					<SecondHalf>s}</SecondHalf>
				</div>
			</StyledRuntimeLink>
		</Container>
	)
}

const Container = styled.nav`
	min-height: 32px;
	grid-column: 3/4;
	font-size: 1.1em;
	display: flex;
	padding-right: 4%; // Adjusts for the weird RS alignment

	@media screen and (max-width: ${Theme.navTreshold1}) {
		grid-column: 2/5;
	}

	@media screen and (max-width: ${Theme.navTreshold2}) {
		grid-column: 1/6;
	}
`

const StyledRuntimeLink = styled(HoverableLink)`
	font-family: ${Theme.headerFont};
	font-weight: 700;
	font-size: 1.2em;
	text-align: center;
	display: block;
	flex: 1;
	padding-bottom: 4px;
`

const FirstHalf = styled.span`
	color: #00356a;
`

const SecondHalf = styled.span`
	color: #0371b8;
`

const IconButton = styled(Button)`
	padding: 0 0 2px;
	height: 21px;
	flex: 1;
	height: 100%;
	align-self: center;
	display: inline-grid;

	& > i {
		font-size: 0.85em;
		margin: auto;
	}

	${Theme.transition("0.6s")};

	&:hover {
		color: ${Theme.linkColor};
	}
`

export default NavigationIcons
