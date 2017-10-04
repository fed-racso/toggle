

function toggleFilterMenu() {
  var $filterMenu = $('.filter-menu');
  $filterMenu.toggleClass('is-open');
  $('.filter-btn').toggleClass('is-open');

};

jQuery(document).ready(function($) {
  var $filterMenuToggle = $('.filter-btn');

  $filterMenuToggle.on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleFilterMenu();
  });

  $('#filterstartDate').pickadate();
  $('#filterendDate').pickadate();

  $('.filter-menu #cancel').click(function(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleFilterMenu();
  });

});

/*
jQuery(document).ready(function($) {
  var $primaryNavToggle = $('.primary-nav-toggle');
  var $parentalLock = $('.parental-lock');

  $primaryNavToggle.on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleOffCanvasMenu();
    closeLocalNav();
    closeModal();
  });

  // // Closes all dropdowns when clicked outside
  // $('html').on('click', function(event) {
  //   event.preventDefault();
  //   closeOffCanvasMenu();
  // });

  $parentalLock.on('click', function(event) {
    event.preventDefault();
    console.log('test');
    $(this).toggleClass('is-active');
  });
});

// Primary Nav Mobile
jQuery(document).ready(function($) {
  var $primaryNavMobile = $('.nav--primary__mobile'),
    $mobileNavFirstLevel = $primaryNavMobile.children(),
    $mobileNavSecondLevel = $mobileNavFirstLevel.children('li').children(),
    $mobileBackButton = $('.mobile__subnav-back');

  $primaryNavMobile.on('click', 'li', function(event) {
    $(this).children('ul').addClass('is-open');
  });


  $mobileBackButton.on('click', function(event) {
    $mobileNavSecondLevel.removeClass('is-open');
    event.stopPropagation();
  });

  // Prevents propagation of events up to body
  $primaryNavMobile.on('click', function(event) {
    event.stopPropagation();
  });
});
*/
