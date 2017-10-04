jQuery(document).ready(function($) {

    var $customtable = $(".customtable");

    if ($customtable.length) {

        var currDay = new Date();
        currDay.setHours(0, 0, 0, 0);
        // var has_skin = $('body').hasClass('has-skin');
        var m_activeTabPosTop = false;

        $(".customtable").each(function(i) {
            var that = $(this);
            var isActiveSet = 0;
            var tabs_count = $(this).find(".tab_content").length;
            var tabs_menu = $(this).find(".tabs");
            var h3_class = "";

            $(this).find(".tab_content").each(function(i) {
                var inTime = true;
                $(this).find(".customtable__subtitle").each(function() {
                    var tabTimestamp = Date._parse($(this).text());

                    if (isNaN(tabTimestamp) == false) {
                        var tabDay = new Date(tabTimestamp);
                        if (tabDay >= currDay) {
                            inTime = true;
                            return false;
                        } else {
                            inTime = false;
                        }

                        if (!inTime && !isActiveSet && tabs_count - 1 == i) {
                            inTime = true;
                        }
                    }
                });

                if (inTime && !isActiveSet) {
                    $(this).fadeIn();
                    isActiveSet = i + 1;
                    // console.log(isActiveSet);
                    that.find('li[rel*="tab' + isActiveSet + '"]').addClass("active");
                    h3_class = " d_active";
                    m_activeTabPosTop = this.offsetTop;
                } else {
                    h3_class = "";
                }

                if (tabs_menu.length) {
                    $(this).before("<h3 class= 'tab_drawer_heading" + h3_class + "' rel='tab" + (i + 1) + "'>" + $(that).find('[rel="tab' + (i + 1) + '"]').text() + "</h3>");
                }


            });

            /* Create Tabs for Desktop */
            var tabs = $(this).find('.tabs');
            if (tabs.length) {
                /* Extra class "tab_last"
                   to add border to right side
                   of last tab */
                // tabs.find('li').last().addClass("tab_last");

                //Add tabs on tabs - start
                tabs.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide) {

                    if (slick.slideCount > slick.options.slidesToShow && (new winprops).screen > 760) {
                        $('ul.tabs').css('width', '95%');
                    } else {
                        $('ul.tabs').css('width', '100%');
                    }

                });

                tabs.slick({
                    initialSlide: isActiveSet - 1,
                    infinite: false,
                    // slidesToShow: has_skin?10:13,
                    //      slidesToScroll: has_skin?10:13,

                    //responsive: [
                    //     {
                    //       breakpoint: 1140,
                    //       settings: {
                    //         slidesToShow: 7,
                    //         slidesToScroll: 7
                    //       }
                    //     }
                    // ]

                    slidesToShow: 7,
                    slidesToScroll: 7
                });
            }

        });

        if (m_activeTabPosTop && (new winprops).isMobile) {
            $("html, body").animate({ scrollTop: m_activeTabPosTop }, 600);
            console.log(m_activeTabPosTop);
        }


        /* events in MOBILE mode */
        $(".tab_container").click(function(e) {
            // console.log(e);
            if (e.target.className == "tab_drawer_heading") {
                $(this).find(".tab_content:visible").hide();

                var activeTab = $(e.target).attr("rel");
                $(this).find("#" + activeTab).fadeIn();

                $("." + e.target.className).removeClass("d_active");
                $(e.target).addClass("d_active");

                $(this).prev().find("li").removeClass("active");
                $(this).prev().find("li[rel*='" + activeTab + "']").addClass("active");
            }

        });

        /* events in DESKTOP mode */
        $(".tabs").click(function(e) {

            if (e.target.localName == "li") {
                var content = $(this).next();
                content.find(".tab_content:visible").hide();

                var activeTab = $(e.target).attr("rel");
                content.find("#" + activeTab).fadeIn();

                $(this).find("li").removeClass("active");
                $(e.target).addClass("active");

                content.find(".tab_drawer_heading").removeClass("d_active");
                content.find(".tab_drawer_heading[rel='" + activeTab + "']").addClass("d_active");
            }

        });

        // Redirect when clicking on rows with a link
        // $(".fixture-clickable-row").click(function(e){
        //     e.preventDefault();
        //     var _url = $(this).data("href");
        //     window.open(_url, '_blank');
        // });
        
        $(".fixture-clickable-row").each(function(){
            var _cell = $(this).find('td');
            var _link = $(this).data('href');

            _cell.wrapInner('<a href="'+_link+'" target="_blank"></a>');
        });
    }

});
