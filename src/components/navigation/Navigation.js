import React from "react"
import styled from "styled-components"
import Theme from "../theme/Theme"
import BannerLink from "../navigation/BannerLink"

const Banner = () => (
	<Container>
		<BannerLink href="/life" title="Life" />
		<BannerLink href="/tech" title="Tech" />
	</Container>
)

const Container = styled.div`
	font-weight: 600;
	font-size: 1.1em;
	text-align: center;
	letter-spacing: 1px;
	display: flex;
	align-items: center;
	grid-column: 2/5;
	padding-top: 4px;

	@media screen and (max-width: ${Theme.navTreshold1}) {
		grid-column: 2/5;
	}

	@media screen and (max-width: ${Theme.navTreshold2}) {
		grid-column: 1/6;
	}
`

export default Banner
