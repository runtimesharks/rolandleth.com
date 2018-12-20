import React from "react"
import styled from "styled-components"
import Link from "./Link"
import Theme from "../theme/Theme"

const ColorOnHoverLink = (props) => {
	return <StyledLink {...props} />
}

const StyledLink = styled(Link)`
	color: ${Theme.textColor};
	border-bottom: none;

	@media (prefers-color-scheme: dark) {
		color: white;
	}

	@media (hover: hover) {
		&:hover {
			color: ${Theme.linkColor};
			border-bottom: none;
		}
	}
`

export default ColorOnHoverLink
