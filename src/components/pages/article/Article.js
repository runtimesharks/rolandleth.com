import React from "react"
import styled from "styled-components"
import ContinueReading from "./ContinueReading"
import ArticleHeader from "./ArticleHeader"
import Helmet from "../../Helmet"
import ReactMarkdown from "react-markdown"

class Article extends React.Component {
	render() {
		const { post } = this.props
		const isTruncated = post.rawBody !== post.truncatedBody

		return (
			<Container>
				<Helmet
					title={post.title}
					description={post.firstParagraph}
					isoDate={post.isoDate}
				/>
				<ArticleHeader {...this.props} />
				<Body>
					<ReactMarkdown
						source={isTruncated ? post.truncatedBody : post.rawBody}
					/>
				</Body>
				{isTruncated ? <ContinueReading {...this.props} /> : ""}
			</Container>
		)
	}
}

const Container = styled.div`
	padding-bottom: 3em;
`

const Body = styled.div`
	margin-top: 0;
`

export default Article
