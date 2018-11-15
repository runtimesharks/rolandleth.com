import React from "react"
import styled from "styled-components"
import ContinueReading from "./ContinueReading"
import ArticleHeader from "./ArticleHeader"
import Helmet from "../../Helmet"

class Article extends React.PureComponent {
	componentDidMount() {
		const postBody = document.getElementsByClassName("post-body")[0]
		postBody.innerHTML = this.props.post.body
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
				<Body className="post-body" />
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
