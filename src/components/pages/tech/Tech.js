import React from "react"
import axios from "axios"
import styled from "styled-components"
import Article from "../article/Article"

class Tech extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			posts: []
		}
	}

	componentDidMount() {
		this.fetchPosts()
	}

	fetchPosts = () => {
		const page = new URLSearchParams(this.props.location.search).get("page")
		var url = "http://localhost:3000/api/tech/posts"

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
		return (
			<Container>
				{this.state.posts.map((post, index) => (
					<Article key={post.link} post={post} index={index} />
				))}
			</Container>
		)
	}
}

const Container = styled.div``

export default Tech
