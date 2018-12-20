import React from "react"
import styled from "styled-components"
import ColorOnHoverLink from "../link/ColorOnHoverLink"

const NavigationLink = (props) => {
	return (
		<Container>
			<ColorOnHoverLink {...props} text={props.title} />
		</Container>
	)
}

const Container = styled.div`
	flex: 1;
`

export default NavigationLink
