import React from "react"
import styled from "styled-components"
import Link from "./Link"
import Theme from "../theme/Theme"

const HoverableLink = (props) => {
	return <StyledLink {...props} />
}

const StyledLink = styled(Link)`
	color: ${Theme.textColor};
	border-bottom-color: transparent;

	&:hover {
		color: ${Theme.linkColor};
	}
`

export default HoverableLink
