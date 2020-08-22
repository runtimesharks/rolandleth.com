import React from "react"
import { Route, Switch } from "react-router-dom"
import styled from "styled-components"
import Footer from "../Footer"
import About from "../pages/About"
import Intro from "../pages/IntroSmall"
import LifeAbout from "../pages/life/LifeAbout"
import PrivacyPolicy from "../pages/PrivacyPolicy"
import SiteHeader from "../site-header/SiteHeader"
import Theme from "../theme/Theme"
import CommonRoutes from "./CommonRoutes"
import OldPostHandler from "./OldPostsHandler"

const Routes = (props) => {
	return (
		<Switch>
			<Route exact path="/" component={Intro} />
			<>
				<SiteHeader query={props.query} />
				<Content>
					<Switch>
						<Route exact path="/privacy-policy" component={PrivacyPolicy} />
						<Route exact path="/about" component={About} />
						<Route exact path="/life" component={LifeAbout} />
						<CommonRoutes path="/life" {...props} />
						<CommonRoutes path="/tech" {...props} />

						{/* This handles `NotFoundPage` too */}
						<Route path="/:oldPost" component={OldPostHandler} />
					</Switch>
				</Content>
				<Footer />
			</>
		</Switch>
	)
}

const Content = styled.div`
	margin: 6em 0 5em 0;

	@media screen and (max-width: ${Theme.phoneMedia}) {
		padding-bottom: 0;
	}
`

export default Routes
