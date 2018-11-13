import React from "react"
import { GlobalStyle } from "./components/theme/globalStyle"
import { GlobalSyntaxStyle } from "./components/theme/globalSyntax"
import Helmet from "./components/Helmet"
import Router from "./components/Router"

class App extends React.PureComponent {
	render() {
		return (
			<React.Fragment>
				<Helmet />
				<Router />
				<GlobalStyle />
				<GlobalSyntaxStyle />
			</React.Fragment>
		)
	}
}

export default App
