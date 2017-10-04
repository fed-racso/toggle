// // Featured Carousel

jQuery(document).ready(function($) {
  'use strict';
  var $fc = $('.fc');
  if($fc.length){

    var $fcmi = $fc.find('.fc__main-image');

    // var $firstImg = $('.fc .main-image__item').first().find('picture');

    // $firstImg.imagesLoaded().done(function(instance){
      // console.log(instance);
      // ---------
      
      //$fcmiContent = $fcmi.find('.main-image__item'),
      //$fcmiImages = $fcmiContent.find('img'),
      //$fcmiGradients = $fcmi.find('.sixteen-nine__gradient, .sixteen-nine__gradient-alt'),
      //$fcmiSixteenNineImages = $fcmi.find('.sixteen-nine').find('img');

      // $fcmi.on('init', function(slick) {
      //   fcmiInit();
      // });

      $fcmi.slick({
        autoplay: true,
        autoplaySpeed: 5000,
        dots: true,
        pauseOnHover: true,
        responsive: [{
          breakpoint: 980,
          settings: {
            fade: false,
            slidesToShow: 1,
          }
        }],
      });

      // $(window).resize($.debounce(50, function() {
      //   setFCMIheight();
      //   // $fcmi.setArrowAndDotPositions();
      // }));
      // setFCMIheight();
      // function fcmiInit() {
      //   setFCMIheight();
      //   // $fcmi.setArrowAndDotPositions();
      // }
      // -------
      // });
  
      // function setFCMIheight() {
        // var ww = $(window).width();
        // $fcmiContent = $fcmi.find('.main-image__item'),
        // $fcmiImages = $fcmiContent.find('img'),
        // $fcmiGradients = $fcmi.find('.sixteen-nine__gradient, .sixteen-nine__gradient-alt'),
        // var $fcmiSixteenNineImages = $fcmi.find('.sixteen-nine').find('img');

        // var imageHeight = 'auto';
        // var SixteenNineImageWidth = '100%';
        // var $fcSlickList = $fc.find('.slick-list');

        // if (ww >= 760) {
        //   imageHeight = $fcmi.getFeaturedCarouselImageHeight();
        //   SixteenNineImageWidth = imageHeight * 16 / 9;
        // } else {
        //   imageHeight = 'auto';
        //   SixteenNineImageWidth = '100%';
        // }

        // $fcSlickList.css('height', imageHeight);
        // $fcmiContent.css('height', imageHeight);
        // $fcmiImages.css('height', imageHeight)
        // $fcmiGradients.css('height', imageHeight);
        // $fcmiSixteenNineImages.css('width', SixteenNineImageWidth);

        // $('.fc').addClass('has-loaded');
      // }  
  }
});
