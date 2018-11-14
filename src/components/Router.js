import React, { Suspense } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import NotFoundPage from "./pages/NotFound"
import Layout from "./Layout"

const About = React.lazy(() => import("./pages/About"))
const Intro = React.lazy(() => import("./pages/Intro"))
const Tech = React.lazy(() => import("./pages/tech/Tech"))
const Life = React.lazy(() => import("./pages/life/Life"))

const Router = (props) => {
	return (
		<BrowserRouter onUpdate={() => window.scrollTo(0, 0)}>
			<Suspense fallback={<div />}>
				{props.children}
				<Layout>
					<Switch>
						<Route exact path="/" component={Intro} />
						<Route exact path="/about" component={About} />
						<Route exact path="/life" component={Life} />
						<Route exact path="/tech" component={Tech} />
						<Route path="*" component={NotFoundPage} />
					</Switch>
				</Layout>
			</Suspense>
		</BrowserRouter>
	)
}

export default Router
