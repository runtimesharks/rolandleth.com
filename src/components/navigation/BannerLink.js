import React from "react"
import styled from "styled-components"

const BannerLink = (props) => {
	return (
		<Link href={props.href} title={props.title}>
			<span>{props.title}</span>
		</Link>
	)
}

const Link = styled.a`
	flex: 1;
	text-align: center;
`

export default BannerLink
