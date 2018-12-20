import React from "react"
import { withRouter } from "react-router-dom"
import styled from "styled-components"
import { GlobalStyle } from "./components/theme/globalStyle"
import { GlobalSyntaxStyle } from "./components/theme/globalSyntax"
import Helmet from "./components/Helmet"
import Routes from "./components/Router"
import Theme from "./components/theme/Theme"
import SiteHeader from "./components/site-header/SiteHeader"
import Footer from "./components/Footer"

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			searchTerm: undefined
		}
	}

	search = (query) => {
		this.setState({ searchTerm: query })
	}

	query = () => {
		let query = ""
		let location = this.props.location
		let q = "query="

		if (location.search.includes(q)) {
			query = decodeURIComponent(location.search)
				.split(q)[1]
				.replace(/[+]/g, " ")
		}

		return query
	}

	componentDidUpdate(prevProps) {
		const location = this.props.location

		if (prevProps.location === location) {
			return
		}

		window.ga("send", "pageview", location.pathname + location.search)
	}

	render() {
		return (
			<React.Fragment>
				<Helmet {...this.props} />
				<GlobalStyle />
				<GlobalSyntaxStyle />
				<SiteHeader
					{...this.props}
					query={this.query()}
					onSearch={this.search}
				/>
				<Content>
					<Routes {...this.state} />
				</Content>
				<Footer />
			</React.Fragment>
		)
	}
}

const Content = styled.div`
	margin: 6em 0 5em 0;

	@media screen and (max-width: ${Theme.phoneMedia}) {
		padding-bottom: 0;
	}
`

export default withRouter(App)
