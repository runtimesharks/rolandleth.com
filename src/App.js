import React from "react"
import { withRouter } from "react-router-dom"
import Helmet from "./components/Helmet"
import Routes from "./components/routes/Router"
import { GlobalStyle } from "./components/theme/globalStyle"

class App extends React.Component {
	query = () => {
		return new URLSearchParams(this.props.location.search).get("query") || ""
	}

	render() {
		return (
			<React.Fragment>
				<Helmet {...this.props} />
				<GlobalStyle />
				<Routes query={this.query()} {...this.props} />
			</React.Fragment>
		)
	}
}

export default withRouter(App)
