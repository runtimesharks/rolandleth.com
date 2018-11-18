import React from "react"
import styled from "styled-components"
import NavigationIcons from "./NavigationIcons"
import NavigationLinks from "./NavigationLinks"
import Theme from "../theme/Theme"
import SearchForm from "../site-header/SearchForm"

class SiteHeader extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isSearchFieldVisible: this.query() !== "",
			query: this.query()
		}
	}

	query = () => {
		if (typeof window === "undefined") {
			return ""
		}

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

		const input = document.getElementsByTagName("input")[0]

		if (this.state.isSearchFieldVisible) {
			input.blur()
		} else {
			input.focus()
		}
	}

	render() {
		return (
			<React.Fragment>
				<SearchForm
					props={this.props}
					query={this.state.query}
					isSearchFieldVisible={this.state.isSearchFieldVisible}
				/>
				<Container>
					<NavigationIcons onSearchClick={this.handleSearchClick} />
					<Border />
					<NavigationLinks />
				</Container>
			</React.Fragment>
		)
	}
}

const Container = styled.header`
	max-width: ${Theme.maxWidth};
	margin: 2em auto 0 auto;
	font-family: ${Theme.headerFont};
	display: grid;
	grid-template-columns: 1fr 1fr 3fr 1fr 1fr;

	@media screen and (max-width: ${Theme.navTreshold1}) {
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
	}

	@media screen and (max-width: ${Theme.navTreshold2}) {
		grid-template-columns: 1fr 1fr 2fr 1fr 1fr;
	}
`

const Border = styled.div`
	grid-column: 1/6;
	border-bottom: 1px solid ${Theme.textColor};
`

export default SiteHeader
