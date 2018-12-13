import React from "react"
import axios from "axios"
import styled from "styled-components"
import BlogPosts from "./BlogPosts"
import BlogPost from "./BlogPost"
import LifeAbout from "../life/LifeAbout"
import Pagination from "./Pagination"
import NotFoundPage from "../NotFound"

class Blog extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			posts: [],
			postsFetched: false
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
			.then((posts) => this.setState({ posts: posts, postsFetched: true }))
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

	pagination = (isList) => {
		if (isList === false) {
			return ""
		}

		return (
			<Pagination
				{...this.props}
				page={this.page()}
				pages={20}
				onPageChange={this.fetchPosts}
			/>
		)
	}

	contentWithPagination = (isList) => {
		if (this.state.postsFetched && this.state.posts.length === 0) {
			return <NotFoundPage />
		}

		return (
			<React.Fragment>
				{this.content(isList)}
				{this.pagination(isList)}
			</React.Fragment>
		)
	}

	render() {
		const isList = this.props.match.params.postLink === undefined

		return <Container>{this.contentWithPagination(isList)}</Container>
	}
}

const Container = styled.div``

export default Blog
