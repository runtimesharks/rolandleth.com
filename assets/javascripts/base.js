$(document).ready(function() {
	$(window).resize(function() {
		resizeImage($('img:not([class])'))
	});

	$('img:not([class])').on('load',function() {
		resizeImage($(this))
	});

	//setTimeout(function() {
	//	$('img').each(function() {
	//		$(this).css('visibility', 'visible');
	//	});
	//}, 100);

	//var query = decodeURIComponent(location.search)
	//	.split("=")[1]
	//	.replace(/[\+]/g, " ");
	var searchField = $('input.search');
	var bannerSearchField = $('input.banner-search');

	// Smaller search field for iPhones, since it doesn't fit at > 13
	var winWidth = $(window).width();
	var size = 17;
	switch (true) {
		case winWidth < 320: size = 11; break;
		case winWidth < 325: size = 12; break;
		case winWidth < 330: size = 15; break;
		case winWidth < 335: size = 16; break;
		default: size = 17; break;
	}
	searchField.attr('size', size);

	//searchField.val(query);
	//bannerSearchField.val(query);

	searchField.on('input', function() {
		bannerSearchField.val(searchField.val());
	});

	bannerSearchField.on('input', function() {
		searchField.val(bannerSearchField.val());
	});
});

var resizeImage = function(img) {
	if (img.width() > $('section').width()) {
		if (!img.closest('.centered-image-wrapper').length) {
			img.wrap("<div class='centered-image-wrapper'></div>");
		}
	}
	else if (img.closest('.centered-image-wrapper').length) {
		img.unwrap()
	}
};
