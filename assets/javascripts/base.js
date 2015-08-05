$(document).ready(function() {
	$(window).resize(function() {
		resizeImage($('img:not([class])'));
	});

	setupSearchFields();
	//setupTruncationWithDotDotDot();

	$('img:not([class])').on('load',function() {
		resizeImage($(this));
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
		img.unwrap();
	}
};

var setupSearchFields = function() {
	var query = decodeURIComponent(location.search)
		.split("query=")[1]
		.replace(/[\+]/g, " ");

	var searchField = $('input.search');
	var bannerSearchField = $('input.banner-search');

	searchField.val(query);
	bannerSearchField.val(query);

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

	searchField.on('input', function() {
		bannerSearchField.val(searchField.val());
	});

	bannerSearchField.on('input', function() {
		searchField.val(bannerSearchField.val());
	});
};

var setupTruncationWithDotDotDot = function() {
	$('.content').dotdotdot({
		/*	The text to add as ellipsis. */
		ellipsis	: ' [...]',

		/*	How to cut off the text/html: 'word'/'letter'/'children' */
		wrap		: 'word',

		/*	Wrap-option fallback to 'letter' for long words */
		fallbackToLetter: true,

		/*	jQuery-selector for the element to keep and put after the ellipsis. */
		after		: null,

		/*	Whether to update the ellipsis: true/'window' */
		watch		: true,

		/*	Optionally set a max-height, if null, the height will be measured. */
		height		: 190,

		/*	Deviation for the height-option. */
		tolerance	: 0,

		/*	Callback function that is fired after the ellipsis is added,
		 receives two parameters: isTruncated(boolean), orgContent(string). */
		callback	: function( isTruncated, orgContent ) {

		},

		lastCharacter	: {

			/*	Remove these characters from the end of the truncated text. */
			remove		: [ ' ', ',', ';', '.', '!', '?' ],

			/*	Don't add an ellipsis if this array contains
			 the last character of the truncated text. */
			noEllipsis	: []
		}
	});
};
