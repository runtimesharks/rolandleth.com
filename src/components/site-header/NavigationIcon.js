import React from "react"
import styled from "styled-components"
import Theme from "../theme/Theme"
import ColorOnHoverLink from "../link/ColorOnHoverLink"

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

const StyledLink = styled(ColorOnHoverLink)`
	text-align: center;
	flex: 1;
	color: ${Theme.textColor};

	@media (prefers-color-scheme: dark) {
		color: white;
	}

	display: ${(props) => (props.isHidden ? "none" : "inline-grid")};

	& > i {
		justify-self: center;
		align-self: center;
	}
`

export default NavigationIcon
