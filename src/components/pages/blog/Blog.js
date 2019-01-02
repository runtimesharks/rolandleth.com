import React from "react"
import { withRouter } from "react-router"
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

		let posts = []

		if (props.post !== undefined) {
			posts.push(props.post)
		}

		this.state = {
			posts: posts,
			postsFetched: false
		}
	}

	fetchPosts = (thePage) => {
		const page = thePage || this.props.page
		let url = `${window.location.protocol}//${window.location.host}/api/${
			this.props.section
		}/posts`

		if (page > 0) {
			url += `?page=${page}`
		}

		axios
			.get(url)
			.then((result) => result.data)
			.then((result) =>
				this.setState({
					posts: result.posts,
					postsFetched: true,
					pages: result.totalPages
				})
			)
			.catch((e) => console.log(e))
	}

	content = (isList) => {
		if (isList) {
			return (
				<BlogPosts fetchPosts={this.fetchPosts} posts={this.state.posts} />
			)
		}

		const post = this.state.posts.filter(
			(post) => post.link === this.props.match.params.postLink
		)[0]

		return <BlogPost post={post} />
	}

	pagination = (isList) => {
		if (isList === false || this.state.postsFetched === false) {
			return ""
		}

		return (
			<Pagination
				{...this.props}
				pages={this.state.pages}
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

		if (
			this.props.section === "life" &&
			isList &&
			this.state.posts.length === 0 &&
			this.state.postsFetched
		) {
			return <LifeAbout />
		}

		return <Container>{this.contentWithPagination(isList)}</Container>
	}
}

const Container = styled.div``

export default withRouter(Blog)
