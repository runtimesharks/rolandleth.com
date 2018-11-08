import React from "react"
import styled from "styled-components"
import Theme from "../theme/Theme"

class SearchForm extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			formSize: this.formSize()
		}
	}

	componentDidMount() {
		window.addEventListener("resize", this.updateFormSize)
	}

	updateFormSize = () => {
		this.setState({ formSize: this.formSize() })
	}

	formSize = () => {
		// Smaller search fields for iPhones, since it doesn't fit at > 13
		const winWidth = window.innerWidth

		// prettier-ignore
		switch (true) {
			case winWidth <= 385: return 10
			case winWidth < 400: return 14
			case winWidth < 415: return 17
			case winWidth < 425: return 18
			default: return 19
		}
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateFormSize)
	}

	render() {
		return (
			<Form
				action="/search"
				method="get"
				isVisible={this.props.isSearchFieldVisible}
			>
				<TextField
					type="text"
					name="query"
					size={this.state.formSize}
					defaultValue={this.props.query}
					maxLength="30"
					placeholder="Search..."
				/>

				{this.props.totalPosts > 1 && (
					<SearchResults>({this.props.totalPosts})</SearchResults>
				)}
			</Form>
		)
	}
}

const Form = styled.form`
	background-color: rgba(0, 0, 0, 0);
	font-size: 0.9em;
	align-self: center;
	grid-column: 1/2;
	padding: 3px 0 0 0;
	position: absolute;

	${Theme.transition("0.3s")};

	z-index: ${(props) => (props.isVisible ? "0" : "-1")};
	opacity: ${(props) => (props.isVisible ? "1" : "0")};
	transform: translateY(${(props) => (props.isVisible ? "-25px" : "-70px")});
`

const TextField = styled.input`
	color: ${Theme.linkColor};
	border: 0;
	border-bottom: none;
	outline: none;
	border-radius: 0;

	font-size: 0.9em;
	text-align: left;

	&:focus {
		border-bottom: 1px solid ${Theme.linkColor};
	}

	${Theme.lightBottomBorder()};
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
`

const SearchResults = styled.div`
	display: inline-block;
	color: ${Theme.linkColor};
	font-family: ${Theme.lightFont};
	font-size: 0.8em;
	margin-left: 2px;
`

export default SearchForm
