import React from "react"
import styled from "styled-components"
import ContinueReading from "./ContinueReading"
import ArticleHeader from "./ArticleHeader"
import Helmet from "../../Helmet"
import ReactMarkdown from "react-markdown"

class Article extends React.Component {
	componentDidMount() {
		const postBody = document.getElementsByClassName(
			`post-body-${this.props.index}`
		)[0]
		// postBody.innerHTML = this.props.post.truncatedBody
	}

	render() {
		const { post } = this.props

		return (
			<Container>
				<Helmet
					title={post.title}
					description={post.firstParagraph}
					isoDate={post.isoDate}
				/>
				<ArticleHeader {...this.props} />
				<Body className={`post-body-${this.props.index}`}>
					<ReactMarkdown source={post.rawBody} />
				</Body>
				<ContinueReading {...this.props} />
			</Container>
		)
	}
}

const Container = styled.div``

const Body = styled.div`
	margin-top: 0;
`

export default Article
