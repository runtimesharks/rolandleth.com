import React from "react"
import axios from "axios"
import BlogPosts from "./BlogPosts"
import BlogPost from "./BlogPost"

class Blog extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			posts: []
		}
	}

	fetchPosts = () => {
		const page = new URLSearchParams(this.props.location.search).get("page")
		var url = `http://localhost:3000/api/${this.props.section}/posts`

		if (parseInt(page, 10) > 0) {
			url += `?page=${page}`
		}

		axios
			.get(url)
			.then((result) => result.data)
			.then((posts) => this.setState({ posts }))
			.catch((e) => console.log(e))
	}

	render() {
		const page = new URLSearchParams(this.props.location.search).get("page")

		if (page || this.props.match.params.postLink === undefined) {
			return (
				<BlogPosts
					{...this.props}
					fetchPosts={this.fetchPosts}
					posts={this.state.posts}
				/>
			)
		}

		const post = this.state.posts.filter(
			(post) => post.link === this.props.match.params.postLink
		)[0]

		return <BlogPost {...this.props} post={post} />
	}
}

export default Blog
