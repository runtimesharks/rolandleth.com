import React from "react"
import styled from "styled-components"
import Theme from "../theme/Theme"

const CodeMentorBanner = () => (
	<Link href="https://www.codementor.io/rolandleth">
		<Image
			className="codementor"
			src="https://cdn.codementor.io/badges/book_session_github.svg"
			alt="Contact me on Codementor"
		/>
	</Link>
)

const Link = styled.a`
	position: relative;
	top: 2px;

	@media screen and (max-width: 486px) {
		top: 8px;
	}
`
const Image = styled.img`
	border-radius: none;
	box-shadow: none;

	@media screen and (max-width: ${Theme.phoneMedia}) {
		max-height: 20px;
	}
`

export default CodeMentorBanner
