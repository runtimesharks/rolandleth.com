import React from "react"
import styled from "styled-components"
import ColorOnHoverLink from "../link/ColorOnHoverLink"

const NavigationLink = (props) => {
	return (
		<StyledLink {...props}>
			<span>{props.title}</span>
		</StyledLink>
	)
}

const StyledLink = styled(ColorOnHoverLink)`
	flex: 1;
	text-align: center;
`

export default NavigationLink
