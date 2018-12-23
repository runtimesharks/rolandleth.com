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

		const split = this.props.location.pathname.split("/")
		const key = split[split.length - 1]

		this.state = {
			date: "",
			title: "",
			body: "",
			key: key,
			redirectLink: undefined
		}
	}

	submit = () => {
		const section = this.props.location.pathname.split("/")[1]
		let url = `${window.location.protocol}//${
			window.location.host
		}/api/${section}/posts`

		axios
			.post(url, this.state)
			.then((result) => result.data.post)
			.then((post) => {
				if (post) {
					this.setState({ redirectLink: post.link })
				}
			})
			.catch((e) => console.log(e))
	}

	render() {
		const createPostKey = process.env.RAZZLE_CREATE_POST_KEY || "roland1"

		if (this.state.key !== createPostKey) {
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
						onChange={(e) => this.setState({ title: e.target.value })}
					/>
				</InputWrapper>

				<InputWrapper>
					<Label>Date: </Label>
					<TextField
						title="Date"
						type="text"
						onChange={(e) => this.setState({ date: e.target.value })}
					/>
				</InputWrapper>

				<InputWrapper>
					<Label>Body: </Label>
					<TextArea
						title="Body"
						rows="20"
						onChange={(e) => this.setState({ body: e.target.value })}
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
