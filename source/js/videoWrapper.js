function videoListSliderSwap() {
  $('.list-slider-item--video').toggleClass('u-isInvisible');
  $('.list-slider-target--video').toggle();
}

jQuery(document).ready(function($) {
  var sliderInitialized;
  var $megaSlider = $('.l-4up--video').find('.megaslider, .megaslider__single, .megaslider__portrait, .megaslider__8, .megaslider__4, .megaslider__8--3up, .megaslider__8--4up-portrait');
  var sliderInitialized;

  $('.video__toggler').on('click', function(event) {
    event.preventDefault();
    var $videoPlayerHolder = $(this).closest('.video__player');
    var $videoAside = $videoPlayerHolder.parent().children().eq(2);

    if ($videoPlayerHolder.hasClass('is-enlarged')) {
      $videoPlayerHolder.removeClass('is-enlarged');
    } else {
      // setTimeout(function() {
      $videoPlayerHolder.addClass('is-enlarged');
      // }, 400);
    }

    $videoAside.toggleClass('is-enlarged');

    videoListSliderSwap();

    if ($megaSlider.hasClass('has-loaded')) {
      sliderInitialized = true;
    }

    if ($megaSlider.length) {

      if (!sliderInitialized) {
        $megaSlider.initNewSlider();
        sliderInitialized = true;
      } else {
        $megaSlider.updateSliders();
      }
      $megaSlider.find('[data-dotdot]').truncateToHeight();
    }
  });
});
