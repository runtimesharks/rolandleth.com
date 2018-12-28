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
			post: { datetime: "", title: "", body: "" },
			isTokenValid: undefined,
			redirectLink: undefined
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

				this.setState({ isTokenValid: true })
			})
			.catch(() => this.setState({ isTokenValid: false }))
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

				<InputWrapper>
					<Label>Title: </Label>
					<TextField
						title="Title"
						type="text"
						onChange={(e) => {
							const state = this.state
							state.post.title = e.target.value
							this.setState(state)
						}}
					/>
				</InputWrapper>

				<InputWrapper>
					<Label>Date: </Label>
					<TextField
						title="Date"
						type="text"
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
