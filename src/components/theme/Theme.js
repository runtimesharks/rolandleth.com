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

	static headerFont = "'American Typewriter', 'Georgia', serif"
	static lightFont = "'Avenir Next', 'Verdana', sans-serif"
	// body_font: "'Avenir Next', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
	static bodyFont = "'Verdana', 'Arial', sans-serif"
	static codeFont = "'SF Mono', 'Menlo', 'Monaco', 'Courier', monospace"

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
			border-top: ${size} solid ${this.lightGray};
		`

	static lightBottomBorder = (size) =>
		css`
			border-bottom: ${size} solid ${this.lightGray};
		`
}

export default Theme
