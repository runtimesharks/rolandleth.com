/**
 * Created by roland on 16.11.2016.
 */

"use strict"

$(document).ready(function() {
	ga('send', 'pageview')
	
	// Home
	$('.home-banner, .home-navigation, .home-footer').on('click', function() {
		var classes = $(this).attr('class').split(" ")
		var type = classes[0].split("-")[1]
		
		ga('send', 'event', 'Home', 'click', 'Home [' + type + ']')
	})
	
	// Posts
	$('.post-title, .post-continue-reading').on('click', function() {
		var label = labelFor(
			$(this).data('post-title'),
			$(this).hasClass('post-continue-reading')
		)
		
		ga('send', 'event', 'Post open', 'click', label)
	})
	
	// Downloads
	$('.download-resume, .download-privacy-policy').on('click', function() {
		var label = ""
		var action = ""
		
		if ($(this).hasClass('download-resume')) {
			label = "Résumé"
			action = "PDF"
		}
		else {
			label = "Privacy Policy"
			action = "md"
		}
		
		ga('send', 'event', 'Download', action, label)
	})
})

function labelFor(postTitle, continueReading) {
	var label = postTitle
	
	if (label == "404") {
		label = $(this).attr('href').splice(1)
	}
	
	if (continueReading) {
		label = "[CR] " + label
	}
	
	return label
}
