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
	query = () => {
		return new URLSearchParams(this.props.location.search).get("query") || ""
	}

	componentDidUpdate(prevProps) {
		const location = this.props.location

		if (prevProps.location.pathname === location.pathname) {
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
				<SiteHeader query={this.query()} />
				<Content>
					<Routes query={this.query()} />
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
