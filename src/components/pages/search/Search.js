import React from "react"
import axios from "axios"
import styled from "styled-components"
import BlogPosts from "../blog/BlogPosts"
import Pagination from "../blog/Pagination"
import NotFoundPage from "../NotFound"

class Search extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			posts: [],
			postsFetched: false
		}
	}

	componentDidMount() {
		if (this.state.posts.length > 0) {
			return
		}

		this.fetchPosts()
	}

	fetchPosts = () => {
		const { location } = window
		const rawPage = new URLSearchParams(location.search).get("page")
		const page = parseInt(rawPage, 10) || 1

		let url = `${location.protocol}//${location.host}/api/${
			this.props.section
		}/search?query=${this.props.query}`

		if (page > 1) {
			url += `&page=${page}`
		}

		axios
			.get(url)
			.then((result) => result.data)
			.then((result) =>
				this.setState({
					posts: result.posts || [],
					postsFetched: true,
					pages: result.totalPages || 0
				})
			)
			.catch((e) => console.log(e))
	}

	render() {
		if (this.state.postsFetched && this.state.posts.length === 0) {
			return <NotFoundPage isSearch={true} />
		}

		if (this.state.posts.length === 0) {
			return ""
		}
		return (
			<Container>
				<BlogPosts fetchPosts={this.fetchPosts} posts={this.state.posts} />
				<Pagination
					{...this.props}
					pages={this.state.pages}
					onPageChange={this.fetchPosts}
				/>
			</Container>
		)
	}
}

const Container = styled.div``

export default Search
