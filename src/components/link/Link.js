import React from "react"
import styled from "styled-components"
import { Link as RouterLink } from "react-router-dom"

class Link extends React.Component {
	content = () => {
		const { props } = this

		if (props.href === undefined) {
			return ""
		}

		const newProps = {
			className: props.className || "blank",
			title:
				props.title ||
				props.text.charAt(0).toUpperCase() + props.text.slice(1)
		}

		return props.href.startsWith("http") ? (
			<Anchor href={props.href} {...newProps}>
				{props.children || props.text}
			</Anchor>
		) : (
			<RouterLink to={props.href} {...newProps}>
				{props.children || props.text}
			</RouterLink>
		)
	}

	render() {
		return this.content()
	}
}

// We can not put the common styles for `a` here,
// since `RouterLink` and the inner article `hrefs`
// have to be styled accordingly, too.
const Anchor = styled.a``

export default Link
