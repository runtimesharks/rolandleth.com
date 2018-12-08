import React from "react"
import styled from "styled-components"
import Article from "../article/Article"

class BlogPost extends React.Component {
	componentDidMount() {
		if (this.props.posts !== undefined && this.props.posts.length > 0) {
			return
		}

		this.props.fetchPosts()
	}

	render() {
		return (
			<Container>
				{this.props.posts.map((post, index) => (
					<Article
						path={this.props.match.url}
						key={post.link}
						post={post}
						index={index}
						isSingle={false}
					/>
				))}
			</Container>
		)
	}
}

const Container = styled.div``

export default BlogPost
