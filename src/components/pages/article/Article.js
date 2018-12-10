import React from "react"
import styled from "styled-components"
import hljs from "highlight.js"
import ContinueReading from "./ContinueReading"
import ArticleHeader from "./ArticleHeader"
import ReactMarkdown from "react-markdown"
import Theme from "../../theme/Theme"
import "highlight.js/styles/ocean.css"

class Article extends React.Component {
	componentDidMount() {
		Array.from(document.getElementsByTagName("code"))
			.filter((e) => e.parentElement.tagName.toLowerCase() === "pre")
			.forEach((e) => hljs.highlightBlock(e))
	}

	render() {
		const { post } = this.props

		if (post.link === undefined) {
			return ""
		}

		const isTruncated =
			post.rawBody !== post.truncatedBody && this.props.isSingle === false

		return (
			<Container>
				<ArticleHeader {...this.props} />
				<Body id="body">
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
	padding: 3em 0 2em;
	${Theme.lightBottomBorder()};
`

const Body = styled.div`
	margin-top: 0;
`

export default Article
