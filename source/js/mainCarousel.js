// Mobile Carousel
jQuery(document).ready(function($) {
  'use strict';
  var $carousel = $('.mc__main-image');

  $carousel.slick({
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
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
