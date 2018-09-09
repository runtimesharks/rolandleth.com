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
	display: inline-block;

	@media screen and (max-width: ${Theme.phoneMedia}) {
		text-align: center;
		width: 100%;
		text-align: center;
	}
`

const BannerLink = styled.a``

export default Banner
