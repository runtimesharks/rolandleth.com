$(document).ready(function() {
	$(window).resize(function() {
		resizeImage($('img:not([class])'));
	});

	setupSearchFields();

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

var setupSearchFields = function() {
	var searchField = $('input.search');
	var bannerSearchField = $('input.banner-search');

	if (location.search.length) {
		var query = decodeURIComponent(location.search)
			.split("query=")[1]
			.replace(/[\+]/g, " ");

		searchField.val(query);
		bannerSearchField.val(query);
	}

	// Smaller search fields for iPhones, since it doesn't fit at > 13
	var winWidth = $(window).width();
	var size = 17;
	switch (true) {
		case winWidth < 280: size = 7; break;
		case winWidth < 300: size = 9; break;
		case winWidth < 320: size = 11; break;
		case winWidth < 325: size = 12; break;
		case winWidth < 330: size = 15; break;
		case winWidth < 335: size = 16; break;
		default: size = 17; break;
	}
	searchField.attr('size', size);

	searchField.on('input', function() {
		bannerSearchField.val(searchField.val());
	});

	bannerSearchField.on('input', function() {
		searchField.val(bannerSearchField.val());
	});
};
