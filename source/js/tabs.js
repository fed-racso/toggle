jQuery(document).ready(function($) {

  $('.tgtabs').not('.tgtabs--epg').tgtabs({
    tabsToSlide: ((new winprops).screen < 480)?1:2,
    prevArrowContents: '<i class="ti-arrow-back"></i>',
    nextArrowContents: '<i class="ti-arrow-next"></i>',
    onAjaxDone: updateSliders
  });
});

  function updateSliders($tabTarget) {
    var $megaSlider = $tabTarget.find('.megaslider, .megaslider__single, .megaslider__portrait, .megaslider__8, .megaslider__4, .megaslider__8--3up, .megaslider__8--4up-portrait');
    if ($megaSlider.length) {
      $megaSlider.initNewSlider();
      $megaSlider.find('[data-dotdot]').truncateToHeight();
    }
    // console.log("updateSliders tabs.js:17")
  }
