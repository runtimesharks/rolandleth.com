import React from "react"
import styled from "styled-components"

const Link = (props) => {
	return (
		<Anchor
			href={props.href}
			className={props.className || "OI"}
			title={
				props.title ||
				props.text.charAt(0).toUpperCase() + props.text.slice(1)
			}
		>
			{props.children || props.text}
		</Anchor>
	)
}

const Anchor = styled.a``

export default Link
