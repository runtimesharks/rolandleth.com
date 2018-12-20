import React from "react"
import { withRouter } from "react-router"
import Article from "../article/Article"

class BlogPosts extends React.Component {
	componentDidMount() {
		if (this.props.posts.length > 0) {
			return
		}

		this.props.fetchPosts()
	}

	render() {
		if (this.props.posts.length === 0) {
			return ""
		}

		return (
			<React.Fragment>
				{this.props.posts.map((post, index) => (
					<Article
						path={this.props.match.url}
						key={post.link}
						post={post}
						index={index}
						isSingle={false}
					/>
				))}
			</React.Fragment>
		)
	}
}

export default withRouter(BlogPosts)
