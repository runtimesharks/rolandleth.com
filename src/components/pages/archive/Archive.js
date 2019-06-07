import axios from "axios";
import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";
import ArticleEntry from "./ArchiveEntry";

class Archive extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			entries: {},
			entriesFetched: false
		}
	}

	fetchPosts = () => {
		const url = `${window.location.protocol}//${window.location.host}/api/${
			this.props.section
		}/archive`

		axios
			.get(url)
			.then((result) => result.data)
			.then((result) =>
				this.setState({
					entries: result,
					entriesFetched: true
				})
			)
			.catch((e) => console.log(e))
	}

	componentDidMount() {
		if (this.state.entries.length > 0) {
			return
		}

		this.fetchPosts()
	}

	render() {
		if (this.state.entries.length === 0) {
			return ""
		}

		return (
			<Container>
				<Helmet>
					<meta name="robots" content="noarchive" />
				</Helmet>

				{Object.keys(this.state.entries).map((year) => (
					<ArticleEntry
						entry={this.state.entries[year]}
						year={year}
						key={year}
					/>
				))}
			</Container>
		)
	}
}

const Container = styled.div``

export default Archive
