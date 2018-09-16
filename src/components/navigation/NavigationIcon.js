import React from "react"
import styled from "styled-components"

const NavigationIcon = (props) => (
	<Link className={props.className} href={props.href}>
		{"\n\t\t"}
		{props.children}
	</Link>
)

const Link = styled.a`
	font-size: 1.4em;
	text-align: center;

	& > i {
		width: 26px;
	}

	&.projects {
		margin-left: 4px;
		margin-right: 3px;
	}

	&.github {
		position: relative;
		top: 0.25px;
	}

	&.user {
		margin-left: -2px;
		margin-right: -1px;
	}

	&.coffee {
		position: relative;
		margin-left: 2px;
		bottom: -2.5px;
	}

	img.patreon {
		height: 19px;
		position: relative;
		bottom: -1.5px;
		margin-left: 2px;
	}
`

export default NavigationIcon
