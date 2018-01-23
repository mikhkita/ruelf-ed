$(document).ready(function(){

    var isRetina = retina();

    function resize(){
       if( typeof( window.innerWidth ) == 'number' ) {
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || 
        document.documentElement.clientHeight ) ) {
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }

        if($('.b-catalog').length){
            var scaleX = 1, scaleY = 1;
            scaleX = ($('.b-catalog-item').innerWidth() - 32) / $('.b-catalog-item').innerWidth();
            scaleY = ($('.b-catalog-item').innerHeight() - 32) / $('.b-catalog-item').innerHeight();
            $('.b-catalog-item-back').css("-webkit-transform", "scale("+scaleX+","+scaleY+")");
            $('.b-catalog-item-back').css("-moz-transform", "scale("+scaleX+","+scaleY+")");
            $('.b-catalog-item-back').css("-ms-transform", "scale("+scaleX+","+scaleY+")");
            $('.b-catalog-item-back').css("-o-transform", "scale("+scaleX+","+scaleY+")");
            $('.b-catalog-item-back').css("transform", "scale("+scaleX+","+scaleY+")");
        }

        $(window).scroll();
    }

    function retina(){
        var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
            (min--moz-device-pixel-ratio: 1.5),\
            (-o-min-device-pixel-ratio: 3/2),\
            (min-resolution: 1.5dppx)";
        if (window.devicePixelRatio > 1)
            return true;
        if (window.matchMedia && window.matchMedia(mediaQuery).matches)
            return true;
        return false;
    }

    $(window).resize(resize);
    resize();

    $.fn.placeholder = function() {
        if(typeof document.createElement("input").placeholder == 'undefined') {
            $('[placeholder]').focus(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function() {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur().parents('form').submit(function() {
                $(this).find('[placeholder]').each(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });
            });
        }
    }
    $.fn.placeholder();

    if(isRetina){
        $("*[data-retina]").each(function(){
            var $this = $(this),
                img = new Image(),
                src = $this.attr("data-retina");

            img.onload = function(){
                $this.attr("src", $this.attr("data-retina"));
            };
            img.src = src;
        });
        $("*[data-back]").each(function(){
            var $this = $(this),
                img = new Image(),
                src = $this.attr("data-back");
            img.onload = function(){
                $this.css("background-image", 'url(' + $this.attr("data-back") + ')');
            };
            img.src = src;
        });
    }

    $('.b-review-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        infinite: true,
        arrows: false,
        speed: 600,
        autoplay: true,
        autoplaySpeed: 3000,
    });

    var arrowOffset = 0,
        footerOffset = 0;
    $(window).scroll(function (){
        if ($(this).scrollTop() > 550){
            $('.arrow-up').removeClass("hide-opacity");
        } else{
            $('.arrow-up').addClass("hide-opacity");
        }
        arrowOffset = $('.arrow-hide').offset().top;
        footerOffset = $('.b-footer').offset().top;
        //если стрелка над футером
        if(arrowOffset + 84 > footerOffset){
            $('.arrow-up').css("position", "absolute");
        }else{
            $('.arrow-up').css("position", "fixed");
        }
    });

    $('.arrow-up').on('click', function(){
        $("body,html").animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    $('.b-catalog-item .b-btn-buy').on('click', function(){
        alert("Добавлено в корзину");
    });

    $('.b-favorites').on('click', function(){
        $(this).toggleClass("active");
        return false;
    });

    $('.color-reset').on('click', function(){
        $('.b-colors-form input[type="checkbox"]').prop("checked", false);
        return false;
    });

    var menuTimer = null;
    $(".b-catalog-menu ul > li > a").hover(function(){
        if($(this).parent().hasClass("active")){
            $(".b-catalog-menu .b-line").addClass("b-line-color");
        }else
            $(".b-catalog-menu .b-line").removeClass("b-line-color");
        clearTimeout(menuTimer);
        moveLine($(this));
    }, function(){
        clearTimeout(menuTimer);
        menuTimer = setTimeout(checkMenu, 300);
    });

    function checkMenu(){
        if( $(".b-catalog-menu ul > li.active > a").length ){
            moveLine($(".b-catalog-menu ul > li.active > a"));
            $(".b-catalog-menu .b-line").addClass("b-line-color");
        }else{
            $(".b-catalog-menu .b-line").removeClass("show");
        }
    }

    function moveLine($el){
        $(".b-catalog-menu .b-line").addClass("show").css({
            "left" : $el.position().left + parseInt($el.css("padding-left").replace(/\D+/g,"")),
            "width" : $el.width()
        });
    }

    checkMenu();

    $('.b-catalog-menu ul > li').mousedown(function(eventObject){
        $(".b-catalog-menu .b-line").addClass("b-line-color");
    });
    $('.b-catalog-menu ul > li').mouseup(function(eventObject){
        $(".b-catalog-menu .b-line").removeClass("b-line-color");
    });
    
	// var myPlace = new google.maps.LatLng(55.754407, 37.625151);
 //    var myOptions = {
 //        zoom: 16,
 //        center: myPlace,
 //        mapTypeId: google.maps.MapTypeId.ROADMAP,
 //        disableDefaultUI: true,
 //        scrollwheel: false,
 //        zoomControl: true
 //    }
 //    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 

 //    var marker = new google.maps.Marker({
	//     position: myPlace,
	//     map: map,
	//     title: "Ярмарка вакансий и стажировок"
	// });

    //  var options = {
    //     $AutoPlay: true,                                
    //     $SlideDuration: 500,                            

    //     $BulletNavigatorOptions: {                      
    //         $Class: $JssorBulletNavigator$,             
    //         $ChanceToShow: 2,                           
    //         $AutoCenter: 1,                            
    //         $Steps: 1,                                  
    //         $Lanes: 1,                                  
    //         $SpacingX: 10,                              
    //         $SpacingY: 10,                              
    //         $Orientation: 1                             
    //     }
    // };

    // var jssor_slider1 = new $JssorSlider$("slider1_container", options);

});