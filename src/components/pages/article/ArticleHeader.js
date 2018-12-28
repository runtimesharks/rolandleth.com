import React from "react"
import { withRouter } from "react-router"
import styled from "styled-components"
import ColorOnHoverLink from "../../link/ColorOnHoverLink"

const ArticleHeader = (props) => {
	const { post } = props
	const { location } = props
	const section = location.pathname.split("/")[1]
	const readingTime = post.readingTime ? `: \u00a0~ ${post.readingTime}` : ""
	const link = `/${section}/blog/${post.link}`

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

export default withRouter(ArticleHeader)
