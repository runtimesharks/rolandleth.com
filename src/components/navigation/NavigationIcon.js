import React from "react"
import styled from "styled-components"

const NavigationIcon = (props) => {
	return (
		<Link href={props.href} title={props.title} isHidden={props.isHidden}>
			{props.children}
		</Link>
	)
}

const Link = styled.a`
	text-align: center;
	flex: 1;

	display: ${(props) => (props.isHidden ? "none" : "inline-grid")};

	& > i {
		justify-self: center;
		align-self: center;
	}
`

export default NavigationIcon
