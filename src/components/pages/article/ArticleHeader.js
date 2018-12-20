import React from "react"
import styled from "styled-components"
import ColorOnHoverLink from "../../link/ColorOnHoverLink"

const ArticleHeader = (props) => {
	const { post } = props
	const readingTime = post.readingTime ? `: \u00a0~ ${post.readingTime}` : ""
	let link = props.path || post.link

	if (props.path !== undefined) {
		link = props.path + "/" + post.link
	}

	return (
		<Container>
			<Date>{post.date + readingTime}</Date>
			<Title>
				<ColorOnHoverLink
					href={link}
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
