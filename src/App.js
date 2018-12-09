import React from "react"
import styled from "styled-components"
import { GlobalStyle } from "./components/theme/globalStyle"
import { GlobalSyntaxStyle } from "./components/theme/globalSyntax"
import Helmet from "./components/Helmet"
import Routes from "./components/Router"
import Theme from "./components/theme/Theme"
import SiteHeader from "./components/site-header/SiteHeader"

const App = (props) => {
	return (
		<React.Fragment>
			<Helmet {...props} />
			<GlobalStyle />
			<GlobalSyntaxStyle />
			<SiteHeader {...props} />
			<Content>
				<Routes />
			</Content>
		</React.Fragment>
	)
}

const Content = styled.div`
	margin: 6em 0 0.5em 2px;

	@media screen and (max-width: ${Theme.phoneMedia}) {
		padding-bottom: 0;
	}
`

export default App
