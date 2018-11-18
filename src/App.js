import React from "react"
import { GlobalStyle } from "./components/theme/globalStyle"
import { GlobalSyntaxStyle } from "./components/theme/globalSyntax"
import Helmet from "./components/Helmet"

class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Helmet />
				<GlobalStyle />
				<GlobalSyntaxStyle />
			</React.Fragment>
		)
	}
}

export default App
