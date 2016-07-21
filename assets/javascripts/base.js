$(document).ready(function() {
	$(window).resize(function() {
		resizeImage($('img:not([class])'));
	});

	setupSearchField();

	var images = $('img:not([class])');
	for (var i = 0; i < images.length; i++) {
		$(images[i]).on('load', function () {
			resizeImage($(this));
		});
	}

	//setTimeout(function() {
	//	$('img').each(function() {
	//		$(this).css('visibility', 'visible');
	//	});
	//}, 100);
});

var resizeImage = function(img) {
	if (img.width() > $('body').width()) {
		if (!img.closest('.centered-image-wrapper').length) {
			img.wrap("<div class='centered-image-wrapper'></div>");
		}
	}
	else if (img.closest('.centered-image-wrapper').length) {
		img.unwrap();
	}
};

var setupSearchField = function() {
	var searchField = $('input.text-field');

	if (location.search.length) {
		var query = decodeURIComponent(location.search)
			.split("query=")[1]
			.replace(/[\+]/g, " ");

		searchField.val(query);
	}

	// Smaller search fields for iPhones, since it doesn't fit at > 13
	var winWidth = $(window).width();
	console.log($(window).width())
	var size = 17;
	switch (true) {
		case winWidth < 280: size = 10; break;
		case winWidth <= 300: size = 13; break;
		case winWidth < 310: size = 16; break;
		case winWidth < 325: size = 18; break;
		case winWidth < 335: size = 19; break;
		default: size = 20; break;
	}
	searchField.attr('size', size);
};
