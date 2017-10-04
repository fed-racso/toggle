jQuery(document).ready(function($) {
    'use strict';

    setTimeout(initNotification, 5000);

    function initNotification() {
        $('.live-notification .notification-bar__contents').slick({
            dots: false,
            appendArrows: $('.live-notification .notification-bar__controls'),
            prevArrow: '<a href="#" class="slick-prev"></a>',
            nextArrow: '<a href="#" class="slick-next"></a>',
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 5000
                // responsive: [{
                //   breakpoint: 980,
                //   settings: {
                //     fade: false,
                //     slidesToShow: 1,
                //     autoplay: true,
                //     autoplaySpeed: 5000,
                //   }
                // }],
        });

        $('.live-notification').show();
    }
});

function notificationBarCloseOnClick(el, event) {
    $(el).closest('.notification-holder').hide();
}

$('.notification-bar__close').click(function(event) {
    notificationBarCloseOnClick($(this), event);
});
