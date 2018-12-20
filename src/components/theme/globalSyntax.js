import { createGlobalStyle } from "styled-components"
import Theme from "./Theme"

export const GlobalSyntaxStyle = createGlobalStyle`
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
`
