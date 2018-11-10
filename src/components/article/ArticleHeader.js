import React from "react"
import styled from "styled-components"
import HoverableLink from "../links/HoverableLink"

const ArticleHeader = ({ post }) => {
	const readingTime = post.readingTime
		? `: \u00a0~ ${post.readingTime} read`
		: ""

	return (
		<Container>
			<Date>{post.date + readingTime}</Date>
			<Title>
				<HoverableLink
					href={post.link}
					title={post.title}
					text={post.title}
				/>
			</Title>
		</Container>
	)
}

const Container = styled.header``

const Date = styled.h4`
	margin: 0;
	color: #aaa;
`

const Title = styled.h1`
	margin: 0;
`

export default ArticleHeader
