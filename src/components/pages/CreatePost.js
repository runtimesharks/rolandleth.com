import React from "react"
import { withRouter } from "react-router"
import { Redirect } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import Theme from "../theme/Theme"
import Helmet from "react-helmet"
import NotFoundPage from "./NotFound"

class CreatePost extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			post: { datetime: "", title: "", body: "", imageURL: "" },
			isTokenValid: undefined,
			redirectLink: undefined,
			posts: []
		}
	}

	componentDidMount() {
		if (this.state.isTokenValid !== undefined) {
			return
		}

		this.checkToken()
	}

	submit = () => {
		const section = this.props.location.pathname.split("/")[1]
		const url = `${window.location.protocol}//${
			window.location.host
		}/api/${section}/posts`

		axios
			.post(url, {
				post: this.state.post,
				token: this.props.match.params.token
			})
			.then((result) => result.data.post)
			.then((post) => {
				if (post === undefined) {
					return
				}

				this.setState({ redirectLink: post.link })
			})
			.catch((e) => console.log(e))
	}

	checkToken = () => {
		const token = this.props.match.params.token
		const url = `${window.location.protocol}//${
			window.location.host
		}/api/create-post-token`

		axios
			.post(url, { token: token })
			.then((result) => {
				if (result.status !== 200) {
					throw new Error("Invalid token")
				}

				this.fetchPosts()
			})
			.catch(() => this.setState({ isTokenValid: false }))
	}

	fetchPosts = () => {
		const section = this.props.location.pathname.split("/")[1]
		const url = `${window.location.protocol}//${
			window.location.host
		}/api/${section}/all-posts`

		axios
			.get(url)
			.then((result) => result.data.posts)
			.then((posts) => this.setState({ isTokenValid: true, posts: posts }))
			.catch(() => this.setState({ isTokenValid: false }))
	}

	handlePostSelection = (event) => {
		if (event.target.value === "") {
			this.setState({
				post: { title: "", datetime: "", body: "", imageURL: "" }
			})

			return
		}

		const post = this.state.posts.filter(
			(post) => post.link === event.target.value
		)[0]

		this.setState({
			post: {
				title: post.title,
				datetime: post.datetime,
				body: post.rawBody,
				imageURL: post.imageURL
			}
		})
	}

	existingPostsSelector = () => {
		if (this.state.posts.length === 0) {
			return ""
		}

		return (
			<select onChange={this.handlePostSelection}>
				<option value="" />
				{this.state.posts.map((post) => (
					<option value={post.link} key={post.link}>
						{post.title}
					</option>
				))}
			</select>
		)
	}

	render() {
		if (this.state.isTokenValid === undefined) {
			return ""
		}

		if (this.state.isTokenValid === false) {
			return <NotFoundPage />
		}

		if (this.state.redirectLink) {
			const section = this.props.location.pathname.split("/")[1]
			return <Redirect to={`/${section}/blog/${this.state.redirectLink}`} />
		}

		return (
			<Container>
				<Helmet>
					<meta name="robots" content="noindex,nofollow" />
				</Helmet>
				<InputWrapper>{this.existingPostsSelector()}</InputWrapper>
				<InputWrapper>
					<Label>Title: </Label>
					<TextField
						title="Title"
						type="text"
						value={this.state.post.title}
						onChange={(e) => {
							const state = this.state
							state.post.title = e.target.value
							this.setState(state)
						}}
					/>
				</InputWrapper>
				<InputWrapper>
					<Label>Image: </Label>
					<TextField
						title="Image"
						type="text"
						value={this.state.post.imageURL}
						onChange={(e) => {
							const state = this.state
							state.post.imageURL = e.target.value
							this.setState(state)
						}}
					/>
				</InputWrapper>
				<InputWrapper>
					<Label>Date: </Label>
					<TextField
						title="Date"
						type="text"
						value={this.state.post.datetime}
						onChange={(e) => {
							const state = this.state
							state.post.datetime = e.target.value
							this.setState(state)
						}}
					/>
				</InputWrapper>
				<InputWrapper>
					<Label>Body: </Label>
					<TextArea
						title="Body"
						rows="20"
						value={this.state.post.body}
						onChange={(e) => {
							const state = this.state
							state.post.body = e.target.value
							this.setState(state)
						}}
					/>
				</InputWrapper>
				<InputWrapper>
					<Button type="submit" onClick={this.submit}>
						Submit
					</Button>
				</InputWrapper>
			</Container>
		)
	}
}

const Container = styled.div``

const Label = styled.h1`
	display: block;
	line-height: 1em;
	font-size: 1.25em;
`

const InputWrapper = styled.div`
	width: 100%;
	display: inline-block;
	margin-top: 10px;
`

const TextField = styled.input`
	margin: 0;
	height: 32px;
	border: 1px solid ${Theme.gray};
	font-family: ${Theme.bodyFont};
	font-size: 1em;
`

const TextArea = styled.textarea`
	padding: 5px;
	font-family: ${Theme.bodyFont};
	font-size: 0.8em;
	width: 96%;
	border: 1px solid ${Theme.gray};

	&:focus {
		outline: transparent none;
		border: 1px solid ${Theme.linkColor};
	}
`

const Button = styled.button`
	color: ${Theme.linkColor};
	font-family: ${Theme.headerFont};
	font-size: 2em;
	border: 0;
	margin: 10px auto;
	display: block;
	background-color: transparent;
	text-align: center;
`

export default withRouter(CreatePost)
