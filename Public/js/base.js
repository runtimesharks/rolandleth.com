function ready(callback) {
	// in case the document is already rendered
	if (document.readyState != "loading") callback()
	// modern browsers
	else if (document.addEventListener)
		document.addEventListener("DOMContentLoaded", callback)
	// IE <= 8
	else
		document.attachEvent("onreadystatechange", () => {
			if (document.readyState == "complete") callback()
		})
}

ready(setupSearchField)

function setupSearchField() {
	var searchField = document.querySelectorAll("input[class=text-field]")[0]

	if (location.search.length) {
		var query = decodeURIComponent(location.search)
			.split("query=")[1]
			.replace(/[\+]/g, " ")

		searchField.setAttribute("placeholder", "")
		searchField.value = query
	}

	// Smaller search fields for iPhones, since it doesn't fit at > 13
	var winWidth = window.innerWidth
	var size = 17

	// prettier-ignore
	switch (true) {
		case winWidth < 280: size = 10; break
		case winWidth <= 385: size = 13; break
		case winWidth < 400: size = 16; break
		case winWidth < 415: size = 18; break
		case winWidth < 425: size = 19; break
		default: return 20
	}

	searchField.setAttribute("size", size)
}
