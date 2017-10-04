// Mobile Carousel
jQuery(document).ready(function($) {
  'use strict';
  var $carousel = $('.sc__main-image');

  $carousel.slick({
    dots: true,
  });

  $carousel.each(function(index, el) {
    $(el).setCarouselHeight();
    $(el).setArrowAndDotPositions();
  });

  $(window).resize($.debounce(150, function(event) {
    $carousel.each(function(index, el) {
      $(el).setCarouselHeight();
    $(el).setArrowAndDotPositions();
    });
  }));
});
