import React from "react"
import axios from "axios"
import styled from "styled-components"
import BlogPosts from "./BlogPosts"
import BlogPost from "./BlogPost"
import LifeAbout from "../life/LifeAbout"
import Pagination from "./Pagination"

class Blog extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			posts: []
		}
	}

	page = () => {
		return (
			parseInt(
				new URLSearchParams(this.props.location.search).get("page"),
				10
			) || 1
		)
	}

	fetchPosts = (thePage) => {
		const page = thePage || this.page()
		var url = `http://localhost:3000/api/${this.props.section}/posts`

		if (page > 0) {
			url += `?page=${page}`
		}

		axios
			.get(url)
			.then((result) => result.data)
			.then((posts) => this.setState({ posts }))
			.catch((e) => console.log(e))
	}

	content = (isList) => {
		if (
			this.props.section === "life" &&
			isList &&
			this.state.posts.length === 0
		) {
			return <LifeAbout />
		}

		if (isList) {
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

	render() {
		const isList = this.props.match.params.postLink === undefined

		return (
			<Container>
				{this.content(isList)}
				{isList ? (
					<Pagination
						{...this.props}
						page={this.page()}
						onPageChange={this.fetchPosts}
					/>
				) : (
					""
				)}
			</Container>
		)
	}
}

const Container = styled.div``

export default Blog
