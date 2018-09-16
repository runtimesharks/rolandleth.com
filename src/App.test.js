import React from "../../Library/Caches/typescript/2.9/node_modules/@types/react/index"
import ReactDOM from "../../Library/Caches/typescript/2.9/node_modules/@types/react-dom/index"
import Base from "./App"

it("renders without crashing", () => {
	const div = document.createElement("div")
	ReactDOM.render(<Base />, div)
	ReactDOM.unmountComponentAtNode(div)
})
