import { createGlobalStyle } from "styled-components"
import Theme from "./Theme"

export const GlobalStyle = createGlobalStyle`
	@import url('https://fonts.googleapis.com/css?family=Titillium+Web:700"');

	/* Reset */
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed,
	figure, figcaption, footer, header, hgroup,
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
		-webkit-font-smoothing: antialiased;
	}

	/* HTML5 display-role reset for older browsers */
	article, aside, details, figcaption, figure,
	footer, header, hgroup, menu, nav, section {
		display: block;
	}

	body {
		line-height: 1;
	}

	ol, ul {
		list-style: none;
	}

	blockquote, q {
		quotes: none;
	}

	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;
	}

	/* Code syntax */
	blockquote {
		${Theme.lightTopBorder("5px")};
		${Theme.lightBottomBorder("5px")};

		margin: 1.5em 1em 1.5em 1em;
		padding: 15px 15px;
		color: $gray;
		font-style: italic;
		font-family: ${Theme.bodyFont};
	}

	code {
		padding: 0.1em 0.2em;
		border-radius: 2px;
		background-color: #F9F9F9;
		color: ${Theme.codeColor};
		white-space: pre-wrap;
		font-size: 0.85em;
		font-family: ${Theme.codeFont};

		@media (prefers-color-scheme: dark) {
			background-color: transparent;
			color: #BE9DE4;
		}

		&.hljs {
			padding: 1em;
		}
	}

	pre {
		overflow: auto;
		${"" /* padding: 0.25em 0 0.25em 1em; */}
		margin: 1em 0;

		border-radius: 2px;
		${"" /* border-left: 2px solid ${Theme.codeColor}; */}
		background-color: #FFF;
		font-size: 0.95em;
		font-family: ${Theme.codeFont};
		line-height: 1.1em;

		code {
			padding-left: 0;
			background-color: #FFF;
			color: ${Theme.preCodeColor};
			white-space: pre;
			font-weight: 300;
			tab-size: 3;
		}
	}

	/* Global stuff */
	body {
		padding: 0 32px;
		color: ${Theme.textColor};
		background: #fff;
		font-family: ${Theme.bodyFont};
		font-size: 17px;
		line-height: 1.65;

		max-width: ${Theme.maxWidth};
		margin: 0 auto;

		@media (prefers-color-scheme: dark) {
			background: ${Theme.textColor};
			color: white;
		}
	}

	li {
		list-style: disc inside;

		> ul > li {
			padding-left: 1.5em;
			list-style-type: circle;
		}
	}

	header {
		font-family: ${Theme.headerFont};
	}

	h1 {
		font-size: 1.85em;
		font-weight: normal;
		display: inline-block;
		font-family: ${Theme.headerFont};
		line-height: 1.2em;
		color: ${Theme.textColor};
		margin: 0.675em 0;

		@media (prefers-color-scheme: dark) {
			color: white;
		}
	}

	h4 {
		font-family: ${Theme.headerFont};
		padding-left: 2px;
		margin-bottom: 20px;
		color: $gray;
		font-weight: 500;
		font-style: italic;
		font-size: 0.75em;
	}

	a {
		text-decoration: none;
		color: ${Theme.linkColor};
		border-bottom: 1px dotted ${Theme.linkColor};

		${Theme.transition("0.4s")};

		@media (hover: hover) {
			&:hover {
				border-bottom: 1px solid ${Theme.linkColor};
			}
		}
	}

	p {
		margin: 1em 0;

		&.no-margin {
			margin: 0;
		}
	}

	em {
		font-style: italic;
	}

	img {
		border-radius: 2px;
		-webkit-box-shadow: #777777 0 0 3px 1px;
		-moz-box-shadow: #444444 0 0 3px 1px; /* color, h-offset, v-offset, blur, spread */
		box-shadow: #777777 0 0 7px 0; /* inset is optional */
		max-width: 100%;

		&:not([class]) {
			display: table;
			margin: 10px auto;
		}

		.centered & {
			display: inline;
			margin: 10px;
		}

		.centered-image-wrapper & {
			margin: 0 auto;
		}
	}

	strong {
		font-weight: bold;
	}

	em {
		font-style: italic;
	}

	.mark {
		background-color: yellow;
		color: black;
	}

	.centered {
		text-align: center;
	}

	.subtitle {
		font-size: 0.8em;
		color: #bcbcbc;
		margin-top: -1em;
		margin-bottom: 0.75em;
	}
`
