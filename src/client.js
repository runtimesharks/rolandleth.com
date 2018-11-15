import App from "./App"
import Router from "./components/Router"
import React from "react"
import { hydrate } from "react-dom"
import ScrollToTop from "./components/ScrollToTop"

hydrate(
	<Router>
		<ScrollToTop>
			<App />
		</ScrollToTop>
	</Router>,
	document.getElementById("root")
)

if (module.hot) {
	module.hot.accept()
}
