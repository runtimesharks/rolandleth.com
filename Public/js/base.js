$(document).ready(function() {
	$(window).on("load", resizeImages)
	$(window).on("resize", resizeImages)

	setupSearchField()
})

function resizeImages() {
	var images = $("img:not([class])")
	for (var i = 0; i < images.length; i++) {
		resizeImage($(images[i]))
	}
}

function resizeImage(img) {
	if (img.width() > $("body").width()) {
		if (!img.closest(".centered-image-wrapper").length) {
			img.wrap("<div class='centered-image-wrapper'></div>")
		}
	} else if (img.closest(".centered-image-wrapper").length) {
		img.unwrap()
	}
}

function setupSearchField() {
	var searchField = $("input.text-field")

	if (location.search.length) {
		var query = decodeURIComponent(location.search)
			.split("query=")[1]
			.replace(/[\+]/g, " ")

		searchField.attr("placeholder", "")
		searchField.val(query)
	}

	// Smaller search fields for iPhones, since it doesn't fit at > 13
	var winWidth = $(window).width()
	var size = 17

	// prettier-ignore
	switch (true) {
		case winWidth < 280: size = 10; break
		case winWidth <= 385: size = 14; break
		case winWidth < 400: size = 16; break
		case winWidth < 415: size = 18; break
		case winWidth < 425: size = 19; break
		default: return 20
	}

	searchField.attr("size", size)
}
