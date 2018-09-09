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

const Container = styled.div`
	max-width: ${Theme.maxWidth};
	margin: 2.5em auto 0 auto;
	font-family: ${Theme.headerFont};

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
`

const BannerBorder = styled.div`
	width: 100%;
	border-bottom: 2px solid ${Theme.textColor};
`

export default SiteHeader
