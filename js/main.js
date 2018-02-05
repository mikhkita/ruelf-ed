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
        footerToBottom();
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

    function isIE() {
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer')
        {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat( RegExp.$1 );
        }
        else if (navigator.appName == 'Netscape')
        {
            var ua = navigator.userAgent;
            var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat( RegExp.$1 );
        }
        return rv == -1 ? false: true;
    }

    $(window).resize(resize);
    resize();

    checkMiniCart();

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

    function updateCatalog(){
        $("*[data-catalog-retina]").each(function(){
            var $this = $(this),
                img = new Image(),
                src = $this.attr("data-catalog-retina");
            img.onload = function(){
                $this.css("background-image", 'url(' + $this.attr("data-catalog-retina") + ')');
                $this.removeAttr("data-catalog-retina");
            };
            img.src = src;
        });
    }

    function footerToBottom(){
        var browserHeight = window.innerHeight,
            footerOuterHeight = !!$('.b-footer').outerHeight() ? $('.b-footer').outerHeight(true) : 0,
            headerHeight = 0;
        if($('.b-header').length){
            headerHeight = $('.b-header').outerHeight(true);
        }else{
            headerHeight = $('.b-header-inner').outerHeight(true);
        }
        var minHeight = browserHeight - footerOuterHeight - headerHeight;
        if(minHeight >= 0){
            $('.b-content').css({
                'min-height': minHeight
            });
        }  
    };

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
        if($('.arrow-hide').length){
            arrowOffset = $('.arrow-hide').offset().top;
            footerOffset = $('.b-footer').offset().top;
            //если стрелка над футером
            if(arrowOffset + 84 > footerOffset){
                $('.arrow-up').css("position", "absolute");
            }else{
                $('.arrow-up').css("position", "fixed");
            }
        }
    });

    $('.arrow-up').on('click', function(){
        $("body,html").animate({
            scrollTop: 0
        }, 300);
        return false;
    });

    $('.b-favorites').on('click', function(){
        $(this).toggleClass("active");
        return false;
    });

    $('.color-reset').on('click', function(){
        $('.b-filter-colors input[type="checkbox"]').prop("checked", false);
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

    var $window = $(window),
        $targetMain = $(".b-content"),
        $hMain = $targetMain.offset().top,
        moveMenu = 0,
        timerBlock = false,
        afterHeader = false;

    /*$window.on('scroll', function() {
        // Как далеко вниз прокрутили страницу
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Если прокрутили скролл ниже макушки нужного блока, включаем ему фиксацию
        if (scrollTop > $hMain){
            console.log("///");
            clearTimeout(moveMenu);
            timerBlock = false;
            $('.b-top').addClass("b-top-fixed b-top-change");
            afterHeader = true;
        }else{
            console.log("++++");
            $('.b-top').removeClass("b-top-change")
            if(scrollTop > 80){
                if(afterHeader){
                    $('.b-top').addClass("b-top-visible");
                }
                if(!timerBlock){
                    timerBlock = true;
                    moveMenu = setTimeout(function(){
                        timerBlock = false;
                        console.log("timer");
                        $('.b-top').removeClass("b-top-fixed b-top-visible");
                    }, 300);
                }
            }else{
                clearTimeout(moveMenu);
                $('.b-top').removeClass("b-top-fixed b-top-visible");
            }
            afterHeader = false;
        }
        $targetMain = $(".b-content"),
        $hMain = $targetMain.offset().top;
    });*/

    $window.on('scroll', function() {
        // Как далеко вниз прокрутили страницу
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Если прокрутили скролл ниже макушки нужного блока, включаем ему фиксацию
        if (scrollTop > 20){
            $('.b-top').addClass("b-top-fixed");
        }else{
            $('.b-top').removeClass("b-top-fixed");
        }
    });

    $(window).scroll();

    if( isIE ){
        $("body").on('mousedown click', ".b-input input, .b-input textarea", function(e) {
            $(this).parents(".b-input").addClass("focus");
        });
    }

    $("body").on("focusin", ".b-input input, .b-input textarea", function(){
        $(this).parents(".b-input").addClass("focus");
    });

    $("body").on("focusout", ".b-input input, .b-input textarea", function(){
        $(this).parents(".b-input").removeClass("focus");
        if( $(this).val() != "" && $(this).val() != "+7 (   )    -  -  " ){
            $(this).parents(".b-input").addClass("not-empty");
        }else{
            $(this).parents(".b-input").removeClass("not-empty");
        }
    });

    $('.b-addressee-switch').on('click', function(){
        if($('.b-addressee-left').hasClass("active")){
            $('.b-addressee-left').removeClass("active");
            $('.b-addressee-right').addClass("active");
            $('#addressee-name, #addressee-phone').prop("disabled", true).parent().addClass("hide");
            $('.b-address').before($(".move-element"))
                .addClass("b-address-margin")
                .parent().addClass("b-input-margin");
            $('.b-input-move').addClass("hide");
        }else{
            $('.b-addressee-right').removeClass("active");
            $('.b-addressee-left').addClass("active");
            $('#addressee-name, #addressee-phone').prop("disabled", false).parent().removeClass("hide");
            $('.b-input-move').prepend($(".move-element")).removeClass("hide");
            $('.b-address').removeClass("b-address-margin").parent().removeClass("b-input-margin");

        }
        return false;
    });

    if($('#date').length){
        $.datepicker.regional['ru'] = {
            closeText: 'Готово', // set a close button text
            currentText: 'Сегодня', // set today text
            monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'], // set month names
            monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'], // set short month names
            dayNames: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'], // set days names
            dayNamesShort: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'], // set short day names
            dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'], // set more short days names
            dateFormat: 'dd.mm.yy' // set format date
        };        
        $.datepicker.setDefaults($.datepicker.regional["ru"]);

        $(function(){
            $("#date").datepicker({
                changeMonth: true,
                minDate: 0
            }).on("change", function(){
                $(this).parents(".b-input").addClass("not-empty");
            });
        });
    }

    $('.b-filter-price-select').on('click', function(){
        $('.b-filter-price-select.icon-arrow-down').toggleClass("arrow-rotate");
        $('.b-filter-price-list').toggleClass("show");
        $('.b-filter-flowers-list').removeClass("show");
        $('.b-filter-flowers-select.icon-arrow-down').removeClass("arrow-rotate");
        return false;
    });
    $('.b-filter-flowers-select').on('click', function(){
        $('.b-filter-flowers-select.icon-arrow-down').toggleClass("arrow-rotate");
        $('.b-filter-flowers-list').toggleClass("show");
        $('.b-filter-price-list').removeClass("show");
        $('.b-filter-price-select.icon-arrow-down').removeClass("arrow-rotate");
        return false;
    });

    $('.b-filter-price-list input:radio').change(function(){
        $('.b-filter-price-select').text($(this).siblings("label").text());
        $('.b-filter-price-list').removeClass("show");
        $('.b-filter-price-select.icon-arrow-down').removeClass("arrow-rotate");
    });

    $('input[name="flowers-list"]').change(function(){
        var count = $('input[name="flowers-list"]:checked').length;
        if(count > 0)
            $('.b-filter-flowers-select').text("Выбрано " + count + " шт.");
        else
            $('.b-filter-flowers-select').text($('.b-filter-flowers-select').attr("data-default"));
        $('input[name="any-flowers"]').prop("checked", false).prop("disabled", false);
    });

    $('input[name="any-flowers"]').change(function(){
        if($(this).prop("checked")){
            $(this).prop("disabled", true);
           $('input[name="flowers-list"]').prop("checked", false);
           $('.b-filter-flowers-select').text($('.b-filter-flowers-select').attr("data-default"));
       }
    });

    $(function(){
      $(document).click(function(event) {
        if ($(event.target).closest(".b-filter-price-list").length) 
            return;
        else{
            $('.b-filter-price-list').removeClass("show");
            $('.b-filter-price-select.icon-arrow-down').removeClass("arrow-rotate");
        }
        if ($(event.target).closest(".b-filter-flowers-list").length) 
            return;
        else{
            $('.b-filter-flowers-list').removeClass("show");
            $('.b-filter-flowers-select.icon-arrow-down').removeClass("arrow-rotate");
        }
        event.stopPropagation();
      });
    });

    $('.b-btn-address').on('click', function(){
        $.fancybox.close(); 
        return false;
    });

    // Добавление в корзину
    var cartTimeout = 0;
    $("body").on("click",".b-btn-to-cart",function(){
        var url = $(this).attr("href");

        if( $("input[name=quantity]").length ){
            url = url + "&quantity=" + $("input[name=quantity]").val();
        }
        clearTimeout(cartTimeout);

        checkMiniCart();

        $.ajax({
            type: "GET",
            url: url,
            success: function(msg){
                $(".b-basket-btn-cont").addClass("show");
                $(".b-basket").html(msg);

                $(".b-basket-btn-total").text( $(".b-basket-total").text() );

                checkMiniCart();

                cartTimeout = setTimeout(function(){
                    $(".b-basket-btn-cont").removeClass("show");
                }, 2000);
            },
            error: function(){
                alert("Ошибка добавления в корзину");
            }
        });
        return false;
    });

    // Удаление из корзины
    var cartTimeout = 0;
    $("body").on("click",".b-btn-remove-from-cart",function(){
        var url = $(this).attr("href"),
            $item = $(".b-cart-item[data-id='"+$(this).parents("li, tr").attr("data-id")+"']");

        $item.hide().addClass("hidden");

        updateMiniCartSum();

        if( $(".b-basket-table").length && $(".b-basket-table tr:not(.hidden)").length <= 1 ){
            $(".b-cart-empty").show();
            $(".b-basket-table, .b-data-order, .b-addition").hide();
        }

        $.ajax({
            type: "GET",
            url: url,
            success: function(msg){
                var reg = /<!--([\s\S]*?)-->/mig;
                msg = msg.replace(reg, "");
                var json = JSON.parse(msg);

                if( json.result == "success" ){
                    $item.remove();
                    
                    $(".b-basket-btn-total, .b-basket-total").text( json.sum );
                }else{
                    alert("Ошибка удаления из корзины");
                    $item.show().removeClass("hidden");
                    $(".b-cart-empty").hide();
                    $(".b-basket-table").show();
                }
            },
            complete: function(){
                setTimeout(checkMiniCart, 10);
            },
            error: function(){
                alert("Ошибка удаления из корзины");
                $item.show().removeClass("hidden");
                $(".b-cart-empty").hide();
                $(".b-basket-table").show();
            }
        });
        return false;
    });

    function checkMiniCart(){
        if( $(".b-basket-total").text() == "0" ){
            $(".b-top").addClass("basket-null");
        }else{
            $(".b-top").removeClass("basket-null");
        }
    }

    function updateMiniCartSum(){
        var sum = 0;
        $(".b-basket li:not(.hidden)").each(function(){
            var price = $(this).find(".b-basket-item-price").text().replace(/[^0-9\.]+/g,"")*1,
                count = $(this).find(".b-basket-item-count").text().replace(/[^0-9\.]+/g,"")*1;

            sum += (price*count);
        });

        $(".b-basket-btn-total, .b-basket-total").text( (sum+"").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') );

        checkMiniCart();
    }

    /*if( typeof autosize == "function" )
        autosize(document.querySelectorAll('textarea'));*/


    
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