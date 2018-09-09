import React from "react"
import SiteHeader from "./components/navigation/SiteHeader"
import "./components/theme/globalStyle"

class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<SiteHeader />
			</React.Fragment>
		)
	}
}

export default App
