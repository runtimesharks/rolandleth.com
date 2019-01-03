import React from "react"
import Helmet from "react-helmet"

const ArticleHelmet = (props) => {
	const { post } = props

	return (
		<Helmet>
			<title>{"Roland Leth: " + post.title}</title>
			<meta name="description" content={post.firstParagraph} />

			<meta property="og:type" content="article" />
			<meta property="og:title" content={post.title} />
			<meta property="og:description" content={post.firstParagraph} />
			<meta property="article:published_time" content={post.isoDate} />

			<meta property="twitter:title" content={post.title} />
			<meta property="twitter:description" content={post.firstParagraph} />
		</Helmet>
	)
}

export default ArticleHelmet
