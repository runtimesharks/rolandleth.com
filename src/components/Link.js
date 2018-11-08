import React from "react"
import styled from "styled-components"

const Link = (props) => {
	return (
		<Anchor
			href={props.href}
			title={
				props.title ||
				props.text.charAt(0).toUpperCase() + props.text.slice(1)
			}
		>
			{props.text}
		</Anchor>
	)
}

export const Anchor = styled.a`
	cursor: pointer;
`

export default Link
