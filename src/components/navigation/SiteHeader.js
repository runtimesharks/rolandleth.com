import React from "react"
import styled from "styled-components"
import Navigation from "./Navigation"
import NavigationIcons from "./NavigationIcons"
import Theme from "../theme/Theme"
import SearchForm from "../navigation/SearchForm"

class SiteHeader extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			isSearchFieldVisible: this.query() !== "",
			query: this.query()
		}
	}

	query = () => {
		let query = ""
		let { location } = window
		let q = "query="

		if (location.search.includes(q)) {
			query = decodeURIComponent(location.search)
				.split(q)[1]
				.replace(/[+]/g, " ")
		}

		return query
	}

	handleSearchClick = () => {
		this.setState({ isSearchFieldVisible: !this.state.isSearchFieldVisible })
	}

	render() {
		return (
			<Container>
				<Navigation />
				<BannerBorder />
				<SearchForm
					props={this.props}
					query={this.state.query}
					isSearchFieldVisible={this.state.isSearchFieldVisible}
				/>
				<NavigationIcons onSearchClick={this.handleSearchClick} />
			</Container>
		)
	}
}

const Container = styled.header`
	max-width: ${Theme.maxWidth};
	margin: 2.5em auto 0 auto;
	font-family: ${Theme.headerFont};
	display: grid;
	grid-template-columns: 2fr 1fr;

	a {
		line-height: 1.25em;
		color: ${Theme.textColor};
		border-bottom: none;

		${Theme.transition("color", "0.4s")};

		&:hover {
			color: ${Theme.linkColor};
			border-bottom: none;
		}
	}

	@media screen and (max-width: ${Theme.navTreshold}) {
		grid-template-columns: 1fr 2fr;
	}
`

const BannerBorder = styled.div`
	grid-column: 1/4;
	border-bottom: 2px solid ${Theme.textColor};

	@media screen and (max-width: ${Theme.navTreshold}) {
		grid-row: 2;
	}
`

export default SiteHeader
