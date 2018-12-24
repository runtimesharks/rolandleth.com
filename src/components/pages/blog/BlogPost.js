import React from "react"
import { withRouter } from "react-router"
import axios from "axios"
import Article from "../article/Article"
import NotFoundPage from "../NotFound"

class BlogPost extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			post: props.post,
			postFetched: props.post !== undefined
		}
	}

	componentDidMount() {
		if (this.state.post) {
			return
		}

		this.fetchPost()
	}

	fetchPost = () => {
		const split = this.props.location.pathname.split("/")
		const post = split[split.length - 1]
		const section = split[1]
		const url = `${window.location.protocol}//${
			window.location.host
		}/api/${section}/posts/${post}`

		axios
			.get(url)
			.then((result) => result.data)
			.then((post) => this.setState({ post: post, postFetched: true }))
			.catch((e) => console.log(e))
	}

	render() {
		const { post } = this.state

		if (post === undefined || post.length === 0) {
			return this.state.postFetched ? <NotFoundPage /> : ""
		}

		return <Article post={post} isSingle={true} />
	}
}

export default withRouter(BlogPost)
