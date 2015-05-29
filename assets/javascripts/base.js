$(document).ready(function() {
  //$('img:not([class])').wrap("<div class='centered-image-wrapper'></div>");

  //setTimeout(function() {
    $('img').each(function() {
      //$(this).css('visibility', 'visible');
      if ($(this).width() > $('section').width() && !$(this).hasClass()) {
        $(this).wrap("<div class='centered-image-wrapper'></div>");
      }
    });
  //}, 500);
});