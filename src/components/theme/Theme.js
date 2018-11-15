import { css } from "styled-components"

class Theme {
	static maxWidth = "700px"

	static linkColor = "#12A8DA"
	static highlighColor = "#fffeca"
	static codeColor = "#703DAA"
	static preCodeColor = "#444"
	static lightGray = "#eee"
	static gray = "#aaa"
	static backgroundColor = "#f7f7f7"
	static textColor = "#3b3b3b"

	static headerFont =
		"Copperplate, 'Copperplate', 'Copperplate Gothic', 'Georgia', serif"
	// body_font: "'Avenir Next', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
	static bodyFont = "'Avenir', '-apple-system', 'Verdana', 'Arial', sans-serif"
	static codeFont = "'SF Mono', 'Menlo', 'Monaco', 'Courier', monospace"

	static navTreshold1 = "700px"
	static navTreshold2 = "450px"
	static phoneMedia = "482px"
	static smallMedia = "374px"
	static smallQuery = '"all and (max-width: 575px)"'

	static transition = (prop, duration) =>
		css`
			-webkit-transition: ${prop} ${duration} ease-in-out;
			-moz-transition: ${prop} ${duration} ease-in-out;
			-o-transition: ${prop} ${duration} ease-in-out;
			transition: ${prop} ${duration} ease-in-out;
		`

	static lightTopBorder = (size) =>
		css`
			border-top: ${size} solid ${Theme.lightGray};
		`

	static lightBottomBorder = (size = "1px") =>
		css`
			border-bottom: ${size} solid ${Theme.lightGray};
		`
}

export default Theme
