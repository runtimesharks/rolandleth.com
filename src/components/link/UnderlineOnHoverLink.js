import React from "react"
import styled from "styled-components"
import Link from "./Link"
import Theme from "../theme/Theme"

const UnderlineOnHoverLink = (props) => {
	return <StyledLink {...props} />
}

const StyledLink = styled(Link)`
	border-bottom: 1px solid transparent;
`

export default UnderlineOnHoverLink
