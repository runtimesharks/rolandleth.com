import React from "react"
import styled from "styled-components"

const NavigationIcon = (props) => (
	<Link href={props.href}>{props.children}</Link>
)

const Link = styled.a`
	text-align: center;
	flex: 1;
	display: inline-grid;

	& > i {
		justify-self: center;
		align-self: center;
	}
`

export default NavigationIcon
