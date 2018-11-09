import React from "react"
import styled from "styled-components"
import HoverableLink from "../links/HoverableLink"
import Theme from "../theme/Theme"

const NavigationIcon = (props) => {
	return (
		<StyledLink
			href={props.href}
			title={props.title}
			isHidden={props.isHidden}
		>
			{props.children}
		</StyledLink>
	)
}

const StyledLink = styled(HoverableLink)`
	text-align: center;
	flex: 1;
	color: ${Theme.textColor};

	display: ${(props) => (props.isHidden ? "none" : "inline-grid")};

	& > i {
		justify-self: center;
		align-self: center;
	}
`

export default NavigationIcon
