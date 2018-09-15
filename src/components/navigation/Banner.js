import React from "react"
import styled from "styled-components"
import Theme from "../theme/Theme"

const Banner = () => (
	<Container role="banner">
		<BannerLink href="/">Roland Leth</BannerLink>
	</Container>
)

const Container = styled.div`
	font-size: 2.5em;
	font-weight: 600;
	line-height: 1em;
	letter-spacing: 1px;

	@media screen and (max-width: ${Theme.navTreshold}) {
		text-align: center;
		grid-column: 1/4;
	}
`

const BannerLink = styled.a``

export default Banner
