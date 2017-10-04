jQuery(document).ready(function($) {
  
  $('.modal-rating').find(".star").on('mouseover', function(event){
    $(this).prevAll().addClass("filled");
    $(this).addClass("filled");
    $(this).nextAll().removeClass("filled");
  });

  $('.modal-rating').find(".star").on("click", function(event) {
    event.preventDefault();
    //save to system
    console.log("rating " +($(this).index()+1) + "clicked");

    $(this).closest(".modal-rating").find(".feedback").css("visibility", "visible");
    $(this).parent().children().off('mouseover click');
    //close this lightbox
    setTimeout(function() {
      var currentLightbox = $.featherlight.current();
      currentLightbox.close();
    }, 3000);
  });
});