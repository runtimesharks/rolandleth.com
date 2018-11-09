import React from "react"
import styled from "styled-components"
import ContinueReading from "./ContinueReading"
import HoverableLink from "../links/HoverableLink"

const Article = ({ post }) => {
	return (
		<Container>
			<Date>{post.date}</Date>
			<Title>
				<HoverableLink
					href={post.link}
					title={post.title}
					text={post.title}
				/>
			</Title>
			<Body>{post.body}</Body>
			<ContinueReading post={post} />
		</Container>
	)
}

const Container = styled.div``

const Date = styled.h4`
	margin-bottom: 0;
	color: #aaa;
`

const Title = styled.h1`
	margin-top: 0;
`

const Body = styled.div`
	margin-top: 0;
`

export default Article
