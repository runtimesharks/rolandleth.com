import React from "react"
import styled from "styled-components"
import Link from "../../link/Link"
import Theme from "../../theme/Theme"

const ContinueReading = ({ post }) => {
	return (
		<Container>
			<StyledLink
				href={post.link}
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

export default ContinueReading
