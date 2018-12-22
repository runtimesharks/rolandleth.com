import React from "react"
import styled from "styled-components"
import UnderlineOnHoverLink from "../../link/UnderlineOnHoverLink"

const ArticleEntry = (props) => {
	return (
		<Container>
			<Year>
				{/* The first character is _, so it's forced as a string, thus the object ordered */}
				{props.year.substring(1, 5)}
			</Year>
			{props.entry.map((post) => {
				return (
					<Title key={post.link}>
						<UnderlineOnHoverLink
							href={`blog/${post.link}`}
							text={post.title}
						/>
					</Title>
				)
			})}
		</Container>
	)
}

const Container = styled.div``

const Year = styled.h1`
	margin: 0.75em 0 0.25em 0;
	font-size: 2.5em;
`

const Title = styled.h2`
	margin: 0;
	font-size: 1.2em;
`

export default ArticleEntry
