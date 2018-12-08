import React from "react"
import styled from "styled-components"
import ContinueReading from "./ContinueReading"
import ArticleHeader from "./ArticleHeader"
import ReactMarkdown from "react-markdown"
import Theme from "../../theme/Theme"

const Article = (props) => {
	const { post } = props

	if (post.link === undefined) {
		return ""
	}

	const isTruncated =
		post.rawBody !== post.truncatedBody && props.isSingle === false

	return (
		<Container>
			<ArticleHeader {...props} />
			<Body>
				<ReactMarkdown
					source={isTruncated ? post.truncatedBody : post.rawBody}
				/>
			</Body>
			{isTruncated ? <ContinueReading {...props} /> : ""}
		</Container>
	)
}

const Container = styled.div`
	padding: 3em 0;
	${Theme.lightBottomBorder()};
`

const Body = styled.div`
	margin-top: 0;
`

export default Article
