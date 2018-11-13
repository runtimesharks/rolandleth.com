import React from "react"
import styled from "styled-components"
import HoverableLink from "../link/HoverableLink"

const NavigationLink = (props) => {
	return (
		<StyledLink {...props}>
			<span>{props.title}</span>
		</StyledLink>
	)
}

const StyledLink = styled(HoverableLink)`
	flex: 1;
	text-align: center;
`

export default NavigationLink
