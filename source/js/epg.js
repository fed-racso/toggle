jQuery(document).ready(function($) {
    var tgtabs = $('.tgtabs--epg');
    var isToday = (Math.floor($('.is-today').index() / 7)) * 7;
    // console.log(isToday);

    if (tgtabs.length) {
        $('.tgtabs--epg').tgtabs({
            tabsPerPage: 7,
            tabsToSlide: 7,
            prevArrowContents: '<i class="ti-arrow-back"></i><span>Prev Week</span>',
            nextArrowContents: '<span>Next Week </span><i class="ti-arrow-next"></i>',
            arrowsAlwaysShown: true,
            //MEDIACORPXIN-1518 -- activate this when JSP is ready.
            animateInit: false,
            startingTab: isToday,
            //startingTab: 7, 
            onAfterArrowChange: afterArrowChange
        });

        if (isToday == 0) {
            $('.tgtabs__prev').hide();
        }

        if (isToday == 21) {
            $('.tgtabs__next').hide();
        }

    }

    // updates date range on EPG
    function afterArrowChange() {
        var $shownItems = this.$tab.filter('.is-shown');
        var startDate = $shownItems.eq(0).attr('data-daymonthyear');
        var endDate = $shownItems.last().attr('data-daymonthyear');
        // console.log($shownItems);
        // console.log(startDate);
        // console.log(endDate);
        $('.epg__visible-start-date').html(startDate);
        $('.epg__visible-end-date').html(endDate);
    }

    // EPG Jump to now 
    //$(window).load(function() {
    jQuery(document).ready(function($) {
        var $itemShowingNow = $('.epg--channel, .epg').find('.tgtab__target.is-today, .tgtab__target.is-active').find('.epg--channel__item.on-now, .epg--channel__item.is-active');
        if ($itemShowingNow.length) {
            var ql = $('.nav--quicklinks').height() || 0;
            var sh = $('.epg__sticky-header').height() || 0;

            var nowShowingTop = $itemShowingNow.offset().top - ql - sh;
            $(window).scrollTop(nowShowingTop);
        }
    });
});

jQuery(document).ready(function($) {
    var $epgNow = $('.epg__now');
    var $epgNext = $('.epg__next');
    var $epgNowHeader = $('.epg__now-header');
    var $epgNextHeader = $('.epg__next-header');

    function epgTruncate() {
        if ($(window).width() > 1140) {
            $('.epg__list').addClass('truncated');
        } else {
            $('.epg__list').removeClass('truncated');
        }
    }
    $epgNowHeader.addClass('is-active');
    $epgNow.addClass('is-active');

    epgTruncate();

    $(window).resize(function(event) {
        epgTruncate();
    });


    $epgNowHeader.on('click', function(event) {
        event.preventDefault();
        if ($(window).width() < 1140) {
            $epgNextHeader.removeClass('is-active');
            $epgNowHeader.addClass('is-active');

            $epgNext.removeClass('is-active');
            $epgNow.addClass('is-active');
        }

        $epgNow.find('[data-dotdot]').truncateToHeight();

    });

    $epgNextHeader.on('click', function(event) {
        event.preventDefault();

        if ($(window).width() < 1140) {
            $epgNowHeader.removeClass('is-active');
            $epgNextHeader.addClass('is-active');

            $epgNow.removeClass('is-active');
            $epgNext.addClass('is-active');
        }

        $epgNext.find('[data-dotdot]').truncateToHeight();
    });
});

// Sticky EPG Navigation
jQuery(document).ready(function($) {
    var $epgHeader = $('.epg__sticky-header');
    var $epgArrows = $('.tgtabs--epg').find('.tgtabs__arrows');

    if ($epgHeader.length) {

        $epgArrows.children().wrapAll('<div class="wrap"></div>');
        phoenixVars.epgNavTop = $epgHeader.offset().top

        imagesLoaded($(window), function() {
            phoenixVars.epgNavTop = $epgHeader.offset().top
        })

        if ($(window).scrollTop() > 0) {

            if (!$epgHeader.hasClass('is-fixed')) {

                $epgHeader.css({
                    position: 'fixed',
                    top: 40
                });
                $epgHeader.addClass('is-fixed');
                // $epgArrows.addClass('is-fixed');

            }
        }

        $(window).scroll(function() {
            if ($(window).scrollTop() > 0) {

                if (!$epgHeader.hasClass('is-fixed')) {

                    $epgHeader.css({
                        position: 'fixed',
                        top: 40
                    });
                    $epgHeader.addClass('is-fixed');
                    // $epgArrows.addClass('is-fixed');

                }
            } else {
                $epgHeader.css({
                    position: 'absolute',
                    top: 0
                });
                $epgHeader.removeClass('is-fixed');
                $epgArrows /*.removeClass('is-fixed')*/ .removeClass('wrap');
            }
        });
    }
});


// EPG Quicklinks Sticky 
jQuery(document).ready(function($) {
    // Only sticky quicklinks if on EPG pages
    if ($('.epg-page').length) {
        $quickLinks = $('.nav--quicklinks');

        phoenixVars.epgQuickLinksTop = $quickLinks.offset().top;

        $quickLinks.css({
            position: 'absolute',
            top: 'auto',
            left: 0,
            right: 0,
            zIndex: 50,
        })

        if ($(window).scrollTop() > 0) {

            if (!$quickLinks.hasClass('is-fixed')) {

                $quickLinks.css({
                    position: 'fixed',
                    top: 0,
                });
                $quickLinks.addClass('is-fixed');

            }
        }

        $(window).scroll(function() {
            if ($(window).scrollTop() > 0) {

                if (!$quickLinks.hasClass('is-fixed')) {

                    $quickLinks.css({
                        position: 'fixed',
                        top: 0,
                    });
                    $quickLinks.addClass('is-fixed');

                }
            } else {
                $quickLinks.css({
                    position: 'absolute',
                    top: 'auto',
                });
                $quickLinks.removeClass('is-fixed');
            }
        });
    }
});
