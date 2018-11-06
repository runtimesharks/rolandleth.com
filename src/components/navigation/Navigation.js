import React from "react"
import styled from "styled-components"
import Theme from "../theme/Theme"

const Banner = () => (
	<Container>
		<BannerLink href="/">Home</BannerLink>
		<BannerLink href="/life-blog">Life</BannerLink>
		<BannerLink href="/tech-blog">Tech</BannerLink>
		<BannerLink href="/about">About</BannerLink>
	</Container>
)

const Container = styled.div`
	font-weight: 600;
	font-size: 1.1em;
	letter-spacing: 1px;
	display: flex;
	align-items: center;
	grid-column: 1/4;
	padding-bottom: 4px;

	@media screen and (max-width: ${Theme.navTreshold}) {
		text-align: center;
		grid-column: 1/4;
	}
`

const BannerLink = styled.a`
	flex: 1;
	text-align: center;
`

export default Banner
