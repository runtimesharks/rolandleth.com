import React from "react"
import { Switch, Route } from "react-router-dom"
import About from "../pages/About"
import Intro from "../pages/Intro"
import LifeAbout from "../pages/life/LifeAbout"
import CommonRoutes from "./CommonRoutes"
import OldPostHandler from "./OldPostsHandler"
import PrivacyPolicy from "../pages/PrivacyPolicy"

const Routes = (props) => {
	return (
		<Switch>
			<Route exact path="/" component={Intro} />
			<Route exact path="/privacy-policy" component={PrivacyPolicy} />
			<Route exact path="/about" component={About} />
			<Route exact path="/life" component={LifeAbout} />
			<CommonRoutes path="/life" {...props} />
			<CommonRoutes path="/tech" {...props} />

			{/* This handles `NotFoundPage` too */}
			<Route path="/:oldPost" component={OldPostHandler} />
		</Switch>
	)
}

export default Routes
