import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import styled from "styled-components"
import "./components/theme/globalStyle"
import SiteHeader from "./components/navigation/SiteHeader"
import About from "./components/About"
import Theme from "./components/theme/Theme"

class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<SiteHeader />
				<Content>
					<BrowserRouter>
						<Switch>
							<Route exact path="/" />
							<Route path="/about" component={About} />
						</Switch>
					</BrowserRouter>
				</Content>
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
