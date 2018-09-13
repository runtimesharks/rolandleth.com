import React from "react"
import styled from "styled-components"
import Banner from "./Banner"
import SearchForm from "./SearchForm"
import Navigation from "./Navigation"
import Theme from "../theme/Theme"

const SiteHeader = (props) => (
	<Container>
		<Banner />
		<SearchForm props={props} />
		<BannerBorder />
		<Navigation />
	</Container>
)

const Container = styled.header`
	max-width: ${Theme.maxWidth};
	margin: 2.5em auto 0 auto;
	font-family: ${Theme.headerFont};
	display: grid;
	grid-template-columns: 2fr;

	a {
		line-height: 1.25em;
		color: ${Theme.textColor};
		border-bottom: none;

		${Theme.transition("color", "0.4s")};

		&:hover {
			color: ${Theme.linkColor};
			border-bottom: none;
		}
	}

	@media screen and (max-width: ${Theme.navTreshold}) {
		grid-template-columns: 2fr 1fr 2fr;
	}
`

const BannerBorder = styled.div`
	grid-column: 1/4;
	border-bottom: 2px solid ${Theme.textColor};

	@media screen and (max-width: ${Theme.navTreshold}) {
		grid-row: 2;
	}
`

export default SiteHeader
