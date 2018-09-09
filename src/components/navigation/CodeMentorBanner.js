import React from "react"
import styled from "styled-components"
import Theme from "../theme/Theme"

const CodeMentorBanner = () => (
	<Link href="https://www.codementor.io/rolandleth">
		<Img
			className="codementor"
			src="https://cdn.codementor.io/badges/book_session_github.svg"
			alt="Contact me on Codementor"
		/>
	</Link>
)

const Link = styled.a`
	position: relative;
	top: 2px;

	@media screen and (max-width: ${Theme.phoneMedia}) {
		top: 6px;
	}
`
const Img = styled.img`
	border-radius: none;
	box-shadow: none;

	@media screen and (max-width: ${Theme.phoneMedia}) {
		max-width: 150px;
		max-height: 25px;
	}
`

export default CodeMentorBanner
