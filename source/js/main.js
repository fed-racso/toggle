// Body click collapse everything 
jQuery(document).ready(function($) {
  $('body').click(function(event) {
    closeOffCanvasMenu();
    closePrimaryNavDropdown();
  });
});

// view more / less for mention here
jQuery(document).ready(function($) {
  var $mentioned = $('.mentioned');
  var $mentionedItems = $mentioned.children('.mentioned__item');
  var $showMore = $mentioned.find('.show-more'),
    mentionedItemsLength = $mentionedItems.length;
  if (mentionedItemsLength) {

    // Init by hiding everything else other than first
    $mentionedItems.not(':eq(0)').hide();
    $showMore.find('span').text(mentionedItemsLength - 1 + ' more mentions');

    $showMore.on('click', function(event) {
      event.preventDefault();
      var $el = $(this),
        $text = $el.find('span'),
        $arrow = $el.find('i');

      $arrow.toggleClass('arrow-down arrow-up');

      if ($el.hasClass('shown')) {
        $el.removeClass('shown');
        $mentionedItems.not(':eq(0)').slideUp('300');
        $text.text(mentionedItemsLength - 1 + ' more mentions');
      } else {
        $el.addClass('shown');
        $mentionedItems.slideDown('300', 'swing');
        $text.text('View less');
      }
    });
  }
});

// jQuery Expander
jQuery(document).ready(function($) {
  var $expander = $('.expander');

  if ($expander.length) {
    $expander.expander({
      slicePoint: 1000,
      widow: 0,
      expandText: '<i class="ti-more"></i><span>More Details</span>',
      expandPrefix: '&hellip;',
      userCollapseText: '<i class="ti-less"></i><span>View Less</span>',
      moreClass: 'more-details',
      lessClass: 'less-details',
      expandEffect: 'slideDown',
      collapseEffect: 'slideUp',
    });
  }
});

// Footer Nav
jQuery(document).ready(function($) {
  var $footerNav = $('.nav--footer');

  $footerNav.on('click', '.l-gi', function(event) {
    var attr = $(this).attr('data-attr');
    // Accordion only for those who has the "has-children" data-attr. Normal link otherwise
    if (attr === 'has-children') {
      event.preventDefault();
      $(this).find('ul').slideToggle(400);
    }
  });
});