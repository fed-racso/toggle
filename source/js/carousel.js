jQuery(document).ready(function($) {
  $.fn.getFeaturedCarouselImageHeight = function() {
    // Full screen full-width / height ratio = 3.917525773
    // Tablet screen full-width / height ratio = 2.692307692
    var ww = $(window).width();
    if (ww >= 980) {
      return $(this).width() / 3.917525773;
    } else if (ww >= 760) {
      return $(this).width() / 2.692307692;
    } else if (ww >= 560) {
      return $(this).width() / 1.78;
    } else
      return $(this).width() * 9 / 16
  }

  hackforFixHeight();
  
  $(window).resize($.debounce(150, function(event) {
      hackforFixHeight();
  }));

  function hackforFixHeight(){
    var baseWidth = $('.fixed-height--square').width();
    var imgHackHeight = baseWidth * 9/16;

    $('.sc .main-image__item').find('picture').find('img').height(imgHackHeight);
  }

  $.fn.setCarouselHeight = function() {
    var $el = $(this);
    var $mc = $el.closest('.mc').length ? $el.closest('.mc') : null;
    var $sc = $el.closest('.sc').length ? $el.closest('.sc') : null;
    var carouselHeight = Math.floor($el.getCarouselImageHeight());

    if ($mc) {
      var $mainImage = $mc.find('picture').find('img');
      var $mainDesc = $mc.find('.main-image__desc');
      if ($(window).width() >= 760) {
        $mainImage.height(carouselHeight);
        $mainDesc.height(carouselHeight);
      } else {
        $mainImage.height('auto');
        $mainDesc.height('auto');
      }
    }
  }

  $.fn.getCarouselImageHeight = function() {
    // return $(this).width() * 9 / 16;
    var $el = $(this);
    var $fc = $el.closest('.fc').length ? $el.closest('.fc') : null;
    var $mc = $el.closest('.mc').length ? $el.closest('.mc') : null;
    var $sc = $el.closest('.sc').length ? $el.closest('.sc') : null;
    var carouselHeight;

    if ($fc) {
      if ($(window).width() <= 560) {
        carouselHeight = $(this).width() * 9 / 16
      }
    }

    if ($mc) {
      if ($(window).width() >= 760) {
        carouselHeight = $(this).width() / 2.967889908;
      } else {
        carouselHeight = $(this).width() * 9 / 16;
      }
    }

    if ($sc) {
      carouselHeight = $el.width() * 9 / 16;
    }

    return carouselHeight
  }

  $.fn.setArrowAndDotPositions = function() {
    var $el = $(this);
    var $arrows = $el.find('.slick-prev, .slick-next');
    var $dots = $el.find('.slick-dots')
    var featuredHeight = $el.getFeaturedCarouselImageHeight();
    var imageHeight = $el.getCarouselImageHeight();
    var arrowHeight = $arrows.eq(0).outerHeight();
    // Checks if its Featured Carousel, if so, do full-width carousel height when window > 980px
    // Else, always 16x9 height. 

    if ($el.closest('.fc').length) {
      if ($(window).width() >= 760) {
        $arrows.css({
          'top': (featuredHeight / 2) - (arrowHeight / 2) + 'px'
        });
        $dots.css({
          //'top': (featuredHeight - 40) + 'px',
          bottom:0
        });
      } else {
        console.log(imageHeight);
        $arrows.css({
          'top': (imageHeight / 2) - (arrowHeight / 2) + 'px'
        });
        $dots.css({
          // 'top': (imageHeight - 40) + 'px',
          bottom:0
        });
      }
    } else {
      $arrows.css({
        'top': (imageHeight / 2) - (arrowHeight / 2) + 'px'
      });
      $dots.css({
        // 'top': (imageHeight - 40) + 'px',
        bottom:0
      });
    }
  }
});

// positioning of arrows
function setArrowAndDotPositions($el) {
  console.log('test');
  var imageHeight = $el.getCarouselImageHeight();
  console.log(imageHeight);
  imagesLoaded($(window), function() {
    var imageHeight = $el.getCarouselImageHeight();
    console.log(imageHeight);
    $el.find('.slick-prev, .slick-next').css('top', imageHeight / 2);
    $el.find('.slick-dots').css({
      //top: imageHeight - 40,
      // start - MEDIACORPXIN-1542
      bottom:0
      // end - MEDIACORPXIN-1542
    });

    // Forces dots to repaint
    forceRedraw($el);
  });
}


jQuery(document).ready(function($) {
  'use strict';
  var $carousel = $('.carousel');
  if ( $carousel.length ) {
    $carousel.slick({
      dots: true,
    });

    $carousel.each(function(index, el) {
      setArrowAndDotPositions($(el));
    });

    $(window).resize($.debounce(150, function(event) {
      $carousel.each(function(index, el) {
        setArrowAndDotPositions($(el));
      });
    }));

    // Calculate Small Carousel Paragraph height 
    var $sc = $('.sc');
    var pHeight, imageHeight;
    imageHeight = Math.floor($('.sc').eq(0).find('.sc__main-image').width() * 9 / 16);
    pHeight = rhythm(12.5) - imageHeight;

    $sc.each(function(index, el) {
      $(el).find('p').css('height', pHeight);
    });

    $(window).resize($.debounce(150, function(event) {
      imageHeight = Math.floor($('.sc').eq(0).find('.sc__main-image').width() * 9 / 16);
      pHeight = rhythm(12.5) - imageHeight;
      $sc.each(function(index, el) {
        $(el).find('p').css('height', pHeight);
      });
    }));
  }  
});

//CAROUSEL GRID ------
jQuery(document).ready(function($) {
  'use strict';
  var $carousel = $('.carousel-grid');
  if ( $carousel.length ) {
    var curr_view = 'mobile';
    var screen_w = $(window).width();

    //Wrap items depending on screen
    if (screen_w > 760) {
      curr_view = 'desktop';
      wrapItemsInCarousel();
      $carousel.slick({
        dots: true,
      });
    }else{
      $carousel.slick({
        dots: true,
      });
    } 

    //If resizing
    $(window).resize($.debounce(150, false, function() {
      if ($(window).width() < 760 && curr_view == 'desktop') {
        $carousel.slick('unslick');
        unwrapItems();
        $carousel.slick({
          dots: false,
        });
        curr_view = 'mobile';
      }

      if (!($(window).width() < 760) && curr_view == 'mobile') {
        $carousel.slick('unslick');
        wrapItemsInCarousel();
        $carousel.slick({
          dots: true,
        });
        curr_view = 'desktop';
      }
    }));
  }  
});

//Wrap 
function wrapItemsInCarousel(){
    
    // var arr_cg = $('.carousel-grid').find('div[class*="cg_pack"]');
    // var final_class;
    // var i, wrap, wrap_number = 0;
    // arr_cg.each(function(){        
    //         var div = $(this);
    //         if (div.hasClass(final_class)) {
    //             wrap = 'entry_wrap_' + wrap_number;
    //             div.attr('data-wrap',wrap);
    //         } else {
    //             wrap_number++;
    //             wrap = 'entry_wrap_' + wrap_number;
    //             div.attr('data-wrap',wrap);
    //         }
    //         // ----
    //         final_class = this.className.split(' ');
    //         final_class = $.grep(final_class, function (item, index) {
    //             return item.trim().match(/^cg_pack--/);
    //         });
    //         // ----
    //         //final_class = this.className;
            
    // });


    //     for (i = 0; i <= wrap_number; i++) {
    //         wrap= 'entry_wrap_' + i;
    //         $('.carousel-grid [data-wrap="'+wrap+'"]').wrap('<div class="carousel-item"/>');
    //     }

    // // pack of 1
    // $(".cg_pack--up1").wrap('<div class="carousel-item"/>');

    // // pack of 2
    // var packof2 = $(".cg_pack--up2");
    // for(var i = 0; i < packof2.length; i+=2) {
    //   packof2.slice(i, i+2).wrapAll('<div class="carousel-item"/>');
    // }

    // // pack of 3
    // var packof3 = $(".cg_pack--up3");
    // for(var i = 0; i < packof3.length; i+=3) {
    //   packof3.slice(i, i+3).wrapAll('<div class="carousel-item"/>');
    // }

    var maxNumImgsBySLide = 3;
    for(var k = 1; k <= maxNumImgsBySLide; k++){
      var packs = $(".cg_pack--up"+k);
      for(var i = 0; i < packs.length; i+=k) {
        packs.slice(i, i+k).wrapAll('<div class="carousel-item"/>');
      }
    }

}

//Unwrap 
function unwrapItems(){
    $('.carousel-item').contents().unwrap();
}
// end - CAROUSEL GRID ------