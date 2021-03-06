import React from "react"
import styled from "styled-components"
import hljs from "highlight.js"
import ContinueReading from "./ContinueReading"
import ArticleHeader from "./ArticleHeader"
import ReactMarkdown from "react-markdown/with-html"
import Theme from "../../theme/Theme"
import "highlight.js/styles/ocean.css"
import Subscription from "../Subscription"
import ArticleHelmet from "./ArticleHelmet"

class Article extends React.Component {
	componentDidMount() {
		Array.from(document.getElementsByTagName("code"))
			.filter((e) => e.parentElement.tagName.toLowerCase() === "pre")
			.forEach((e) => hljs.highlightBlock(e))
	}

	helmet = (post) => {
		if (this.props.isSingle === false) {
			return ""
		}

		return <ArticleHelmet post={post} />
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
				{this.helmet(post)}
				<ArticleHeader {...this.props} />
				<Body>
					<ReactMarkdown
						source={isTruncated ? post.truncatedBody : post.rawBody}
						escapeHtml={false}
					/>
				</Body>
				{isTruncated ? <ContinueReading {...this.props} /> : ""}
				{this.props.isSingle ? <Subscription /> : ""}
			</Container>
		)
	}
}

const Container = styled.div`
	padding-bottom: 2em;
	margin-bottom: 3em;
	${Theme.lightBottomBorder()};
`

const Body = styled.div`
	margin-top: 0;
`

export default Article
