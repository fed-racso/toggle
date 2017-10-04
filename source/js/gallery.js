// VARIABLES
var currSlide = 0;

// FUNCTIONS
var setupGalleryDimensions = function(){  
  var galleryHeight = $('.gc__main').height($('.gc__main').width()*0.66);
  $('.gc__main').height($('.gc__main').width()*0.66);
  $('.gc__main .gc__main-image .main-image__item picture').height($('.gc__main').width()*0.66);
  // var galHeight = $('.gc__main').height();
  // $('.gc__main .gc__main-image .main-image__item').each(function(){
  //   // var thisPic = $(this).find('picture img');
  //   // thisPic.css('width','auto');
  //   // thisPic.css('height','auto');
  //   // var picWidth = thisPic.width();
  //   // var picHeight = thisPic.height();

  //   // Remove this and handling with CSS
  //   // imagesLoaded($(window), function() {
  //   //   if(picHeight >= galHeight){
  //   //     thisPic.css('width','auto');
  //   //     thisPic.css('height','100%');
  //   //   }
  //   //   if(picHeight <= galHeight){
  //   //     var currentPicHeight = galHeight - thisPic.height();
  //   //     thisPic.css('top',currentPicHeight/2);
  //   //     //thisPic.css('width','100%');
  //   //   }
  //   // });
  // });
}
/*
var updateSlide = function(_slider){
  if((_slider.currentSlide+1) == _slider.slideCount){
    $('.gc__hide-on-last').hide();
  } else {
    $('.gc__hide-on-last').show();

    // Show current slide index
    $('.gc__main-image--index').text( (_slider.currentSlide+1) + '/' + (_slider.slideCount-1) );
    
    // Show the caption/header/credit/description
    $('.gc__caption').html($('.main-image__item.slick-active .main-image__caption').html());
    $('.gc__header').html($('.main-image__item.slick-active .main-image__header').html());
    $('.gc__credit').html($('.main-image__item.slick-active .main-image__credit').html());
    $('.gc__story').html($('.main-image__item.slick-active .main-image__story').html());

    // Update the url
    window.location.hash = "slideshow-" + (_slider.currentSlide + 1);

    // Update the url for full screen gallery
    $('.gc__main-image--fullscreen a').attr('href', '?photogalleryfullscreen=true#slideshow-' + (_slider.currentSlide + 1));
    
    // Highlight nav slide
    highlightNavSlide(_slider.currentSlide);
  }
}*/

var slidezUpdate = function(slideNum){
  // Update the url
  window.location.hash = "slideshow-" + (slideNum.currentSlide + 1);

  if($('.main-image__item').hasClass('more-galleries')){
    // Show current slide index
    $('.gc__main-image--index').text( (slideNum.currentSlide+1) + '/' + (slideNum.slideCount-1) );

    if(slideNum.currentSlide+1 > slideNum.slideCount-1){
      $('.gc__hide-on-last').hide();
    }else{
      $('.gc__hide-on-last').show();
    }
  }else{
    // Show current slide index without more galleries
    $('.gc__main-image--index').text( (slideNum.currentSlide+1) + '/' + slideNum.slideCount );
  }

  // Update the url for full screen gallery
  $('.gc__main-image--fullscreen a').attr('href', '?photogalleryfullscreen=true#slideshow-' + (slideNum.currentSlide + 1));

  // Show the caption/header/credit/description
    $('.gc__caption').html($('.main-image__item.slick-active .main-image__caption').html());
    $('.gc__header').html($('.main-image__item.slick-active .main-image__header').html());
    $('.gc__credit').html($('.main-image__item.slick-active .main-image__credit').html());
    $('.gc__story').html($('.main-image__item.slick-active .main-image__story').html());
}

var highlightNavSlide = function(_slideNum){
  $('.nav-image__item').removeClass('item-slick-selectedz');
  $('.nav-image__item[data-slick-index="'+_slideNum.currentSlide+'"]').addClass('item-slick-selectedz');
}

var setupSlideNav = function(slides){
  $('.nav-image__item').click(function(){        
    var navSlideNow = $(this).attr('data-slick-index');
    sliderControl(navSlideNow);
    $('.gc__main-image').slick('slickGoTo', navSlideNow);

    var mainCount = $('.main-image__item').length;
    var navCount = $('.gc__slider-nav li').length;  
    var diffCount = mainCount - navCount;
    
    if((mainCount-2) > navCount)
    $('.gc__slider-nav').slick('slickGoTo', (navCount-1));
  });
}



function sliderControl(slideOrder){
  $('.gc__slider-nav').find('.slick-track').find('.nav-image__item').each(function(){
    var itemNumz = $(this).attr('data-slick-index');

    if (itemNumz == slideOrder){
        $('.gc__slider-nav .slick-track .nav-image__item').removeClass('item-slick-selectedz');
        $(this).addClass('item-slick-selectedz');
    }
  });
  slidezUpdate(slideOrder);
}

jQuery(document).ready(function($) {
  var hashz = window.location.hash;
  var hashzSub = hashz.substr(11);
  var mainCount = $('.main-image__item').length;
  
  if(hashzSub == ''){
    hashzSub = 1;
  }
  if($('.gc__main-image').length){ 
    $('.gc__main-image').on('init', function(slick){
      setupGalleryDimensions();

      if($('.main-image__item').hasClass('more-galleries')){
        // Show current slide index
        $('.gc__main-image--index').text( hashzSub + '/' + (mainCount-1) );
      }else{
        // Show current slide index without more galleries
        $('.gc__main-image--index').text( hashzSub + '/' + mainCount);
      }

      // Update the url for full screen gallery
      $('.gc__main-image--fullscreen a').attr('href', '?photogalleryfullscreen=true#slideshow-' + hashzSub);

      $('.gc__caption').html($('.main-image__item.slick-active .main-image__caption').html());
      $('.gc__header').html($('.main-image__item.slick-active .main-image__header').html());
      $('.gc__credit').html($('.main-image__item.slick-active .main-image__credit').html());
      $('.gc__story').html($('.main-image__item.slick-active .main-image__story').html());
    });

    $('.gc__slider-nav').on('init', function(event, slick){
      if(slick.slideCount <= slick.options.slidesToShow){
            $('.gc__slider-nav-arrows').hide();
      }
      $('.nav-image__item[data-slick-index="'+ (hashzSub-1) +'"]').addClass('item-slick-selectedz');
      setupSlideNav();
    });

    $('.gc__main-image').slick({
      dots: true,
      infinite: false,
      prevArrow: $('.gc__main-slider-arrows.left'),
      nextArrow: $('.gc__main-slider-arrows.right'),
      // initialSlide: hashzSub-1,
      asNavFor: '.gc__slider-nav'
    });

    $('.gc__main-image').on('afterChange', function(slick,currentSlide){
      slidezUpdate(currentSlide);
      sliderControl(currentSlide);
      highlightNavSlide(currentSlide);
    });
    
    $('.gc__slider-nav').slick({
      infinite: false,
      prevArrow: $('.gc__slider-nav-arrows.left'),
      nextArrow: $('.gc__slider-nav-arrows.right'),
      centerMode:false,
      // initialSlide:hashzSub-1,
      slidesToShow: 6,
      slidesToScroll: 1,
      dots: true,
    });

    $('.nav-image__item').click(function(){ 
      setupSlideNav();
    });
  }

  $('.gc__main-image, .gc__main-image').slick('slickGoTo',hashzSub-1,true);

  var sliderz = hashzSub-1;
  sliderz = parseInt(sliderz);

  // console.log('slider' + sliderz);

  // $('.nav-image__item').click(function(){    
  //   sliderz = $(this).attr('data-slick-index');
  //   console.log('slider' + sliderz);
  //   slidezUpdate(sliderz);
  //   sliderz = parseInt(sliderz);
  // });

  // $('.gc__main-slider-arrows.right').click(function(e){
  //   e.preventDefault();
  //   sliderz = sliderz + 1;
  //   console.log('slider' + sliderz);
  //   sliderControl(sliderz);
  // });

  // $('.gc__main-slider-arrows.left').click(function(e){
  //   e.preventDefault();
  //   sliderz = sliderz - 1;
  //   console.log('slider' + sliderz);
  //   sliderControl(sliderz);
  // });

  $(window).resize(function(){
    setupGalleryDimensions();
  });
  /*
  if($('.gc__main-image').length){ 
    sliderControl(sliderz);
    setupSlideNav(hashzSub-1);
  }*/
});

$(window).load(function(){
  setupGalleryDimensions();
});