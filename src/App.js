import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import styled from "styled-components"
import { GlobalStyle } from "./components/theme/globalStyle"
import SiteHeader from "./components/navigation/SiteHeader"
import About from "./components/About"
import Theme from "./components/theme/Theme"
import Intro from "./components/Intro"

class App extends React.PureComponent {
	render() {
		return (
			<React.Fragment>
				<SiteHeader />
				<Content>
					<BrowserRouter>
						<Switch>
							<Route exact path="/" component={Intro} />
							<Route path="/about" component={About} />
						</Switch>
					</BrowserRouter>
				</Content>
				<GlobalStyle />
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
