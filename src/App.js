import React, { Suspense } from "react"
import styled from "styled-components"
import { GlobalStyle } from "./components/theme/globalStyle"
import { GlobalSyntaxStyle } from "./components/theme/globalSyntax"
import SiteHeader from "./components/navigation/SiteHeader"
import Theme from "./components/theme/Theme"
import Helmet from "./components/Helmet"
import Router from "./components/Router"

class App extends React.PureComponent {
	render() {
		return (
			<React.Fragment>
				<Helmet />
				<SiteHeader />
				<Content>
					<Router />
				</Content>
				<GlobalStyle />
				<GlobalSyntaxStyle />
			</React.Fragment>
		)
	}
}

const Content = styled.div`
	margin: 6em 0 0.5em 2px;

	@media screen and (max-width: ${Theme.phoneMedia}) {
		padding-top: 4em;
		padding-bottom: 0;
	}
`

export default App
