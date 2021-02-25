import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import ScrollToTop from "./components/ScrollToTop"

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate

renderMethod(
	<BrowserRouter>
		<ScrollToTop>
			<App />
		</ScrollToTop>
	</BrowserRouter>,
	document.getElementById("root")
)

if (module.hot) {
	module.hot.accept()
}
