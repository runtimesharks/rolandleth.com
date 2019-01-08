import React from "react"
import { withRouter } from "react-router"
import styled from "styled-components"
import Link from "../../link/Link"
import Theme from "../../theme/Theme"

const ContinueReading = (props) => {
	const { post } = props
	const section = props.location.pathname.split("/")[1]
	const link = `/${section}/blog/${post.link}`

	return (
		<Container>
			<StyledLink
				href={link}
				title={`Continue Reading ${post.title}`}
				text="Continue reading &rarr;"
			/>
		</Container>
	)
}

const StyledLink = styled(Link)`
	font-family: ${Theme.headerFont};
`

const Container = styled.div`
	font-family: ${Theme.$headerFont};
	letter-spacing: 2px;
	margin-top: 20px;
`

export default withRouter(ContinueReading)
