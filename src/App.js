import React from "react"
import styled from "styled-components"
import { GlobalStyle } from "./components/theme/globalStyle"
import { GlobalSyntaxStyle } from "./components/theme/globalSyntax"
import Helmet from "./components/Helmet"
import Routes from "./components/Router"
import Theme from "./components/theme/Theme"
import SiteHeader from "./components/site-header/SiteHeader"

const App = (props) => {
	// We pass this from the server when using SSR.
	let location = props.location

	// We use the `window`'s location when rendering on the client.
	if (typeof window !== "undefined") {
		location = window.location.href
	}

	return (
		<React.Fragment>
			<Helmet {...props} location={location} />
			<GlobalStyle />
			<GlobalSyntaxStyle />
			<SiteHeader {...props} location={location} />
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
