import React from "react"
import styled from "styled-components"
import Theme from "../theme/Theme"

class SearchForm extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			formSize: formSize(),
			query: query()
		}
	}

	componentDidMount() {
		window.addEventListener("resize", () => {
			this.setState({
				formSize: formSize()
			})
		})
	}

	componentWillUnmount() {
		window.removeEventListener("resize")
	}

	render() {
		return (
			<Form action="/search" method="get">
				<TextField
					type="text"
					name="query"
					size={this.state.formSize}
					defaultValue={this.state.query}
					maxlength="30"
					placeholder="Search..."
				/>

				{this.props.isSearch &&
					this.props.totalPosts > 1 && (
						<SearchResults>({this.props.totalPosts})</SearchResults>
					)}
			</Form>
		)
	}
}

function query() {
	let query = ""
	let { location } = window

	if (location.search.length) {
		query = decodeURIComponent(location.search)
			.split("query=")[1]
			.replace(/[+]/g, " ")
	}

	return query
}

function formSize() {
	// Smaller search fields for iPhones, since it doesn't fit at > 13
	const winWidth = window.innerWidth

	// prettier-ignore
	switch (true) {
		case winWidth < 280: return 10
		case winWidth <= 300: return 13
		case winWidth < 310: return 16
		case winWidth < 325: return 18
		case winWidth < 335: return 19
		default: return 20
	}
}

const Form = styled.form`
	background-color: rgba(0, 0, 0, 0);
	margin-bottom: 11px;
	align-self: end;

	@media screen and (max-width: ${Theme.navTreshold}) {
		grid-row: 3;
		grid-column: 1;
		justify-self: start;
		align-self: start;
		margin-top: 4px;
	}
`

const TextField = styled.input`
	padding: 4px 0;
	color: ${Theme.linkColor};
	border: 0;
	text-align: right;
	border-bottom: none;
	outline: none;
	border-radius: 0;

	${Theme.transition("0.6s")};

	font-family: ${Theme.lightFont};
	font-size: 1em;

	&::-webkit-input-placeholder {
		color: ${Theme.gray};
	}
	&::-moz-placeholder {
		color: ${Theme.gray};
	}
	&:-moz-placeholder {
		color: ${Theme.gray};
	}

	&:focus {
		&::-webkit-input-placeholder {
			color: ${Theme.linkColor};
		}
		&::-moz-placeholder {
			color: ${Theme.linkColor};
		}
		&:-moz-placeholder {
			color: ${Theme.linkColor};
		}
	}

	@media screen and (max-width: ${Theme.navTreshold}) {
		${Theme.lightBottomBorder};

		font-size: 0.9em;
		text-align: left;

		&:focus {
			border-bottom: 1px solid ${Theme.linkColor};
		}
	}
`

const SearchResults = styled.div`
	display: inline-block;
	color: ${Theme.linkColor};
	font-family: ${Theme.lightFont};
	font-size: 0.8em;
	margin-left: 2px;
`

export default SearchForm
