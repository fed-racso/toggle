;var rem;
var baseline = 1.25;

function rhythm(multiple) {
  return multiple * rem * baseline;
}

// (function getRemPx() {

//   var testElem = document.createElement('i');

//   var important = "!important;";
//   var style = "width:1rem" + important + "margin: 0" + important + "font-size:1rem" + important + "padding: 0" + important;
//   testElem.style.cssText = style;
//   testElem.innerHTML = 'test';
//   document.body.appendChild(testElem);

//   rem = testElem.clientWidth;

//   document.body.removeChild(testElem);
// })()

function forceRedraw(el) {
  'use strict';
  el.css('webkit-transform', 'scale3d(1,1,1)');
}

// ==========
// Custom Short jQuery plugins
// ==========


jQuery(document).ready(function($) {

  // Truncation with data-dotdot && dotdotdot.js 
  $.fn.truncateToHeight = function(resize) {
    var $els = $(this);

    _.forEach($els, function(el) {
      truncate(el, resize);
    });

    function truncate(el) {
      var $el = $(el);
      var truncated;

      // If already truncated, ignore. 
      if ($el.attr('truncated') === "true" && !resize) {
        return false;
      }

      var numLines = parseInt($el.attr('data-dotdot'));  
      var content = $el.text();
      var zh = false;
      if (content.match(/[\u3400-\u9FFF]/)){
       var zh = true; 
      }

      if (isNaN(numLines)) {
        $el.dotdotdot();
      } else {
        var lineHeight = parseInt($el.css('line-height'));
        $el.dotdotdot({
          wrap: zh?'letter':'word',
          height: numLines * lineHeight,
          lastCharacter : {
       
            /*  Remove these characters from the end of the truncated text. */
            remove    : [ ' ', ',', ';', '.', '-', ':' ]
          }
        });
      }


      // set truncated to true 
      $el.attr('truncated', 'true');
    }
  };

  // Swap to mobile/desktop when resizing 
  $(window).resize(function() {
    if (! new winprops().isMobile) {
      $('body').addClass('is-desktop');
    } else {
      $('body').removeClass('is-desktop');
    }
  });
});

// // Scroll Stop Function 
// jQuery(document).ready(function($) {
//   $.fn.scrollStop = function(callback, timeout) {
//     timeout = timeout ? timeout : 250;
//     this.on('scroll', function(event) {
//       event.preventDefault();
//       clearTimeout($.data(this, "scrollCheck"));
//       $.data(this, "scrollCheck", setTimeout(callback, timeout));
//     });
//   }
// });


// **********************************
// Add this at top of page inside JSP AND  !!!! ACTIVATE IT TO TEST IN LOCALHOST !!!
// **********************************
function winprops() {
    this.screen = window.innerWidth || document.documentElement.clientWidth;
    this.isMobile = (navigator.userAgent.match(/Mobi/) || this.screen < 760 || navigator.userAgent.match(/Android/i)) ? true : false;
}

(function() {
    if (!new winprops().isMobile) {
        document.body.className += 'is-desktop';
    }
})();


// **********************************
// **********************************

