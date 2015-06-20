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