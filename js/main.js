$(document).ready(function(){
    var isRetina = retina(),
        isDesktop = false,
        isTablet = false,
        isMobile = false,
        timerAdvantage,
        prevWidth = 0,
        countQueue = {},
        maxBasketCount = 20;

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

        /*if($('.b-catalog').length){
            var scaleX = 1, scaleY = 1;
            scaleX = ($('.b-catalog-item').innerWidth() - 32) / $('.b-catalog-item').innerWidth();
            scaleY = ($('.b-catalog-item').innerHeight() - 32) / $('.b-catalog-item').innerHeight();
            $('.b-catalog-item-back').css("-webkit-transform", "scale("+scaleX+","+scaleY+")");
            $('.b-catalog-item-back').css("-moz-transform", "scale("+scaleX+","+scaleY+")");
            $('.b-catalog-item-back').css("-ms-transform", "scale("+scaleX+","+scaleY+")");
            $('.b-catalog-item-back').css("-o-transform", "scale("+scaleX+","+scaleY+")");
            $('.b-catalog-item-back').css("transform", "scale("+scaleX+","+scaleY+")");
        }*/

        if( myWidth > 1023 ){
            isDesktop = true;
            isTablet = false;
            isMobile = false;
        }else if( myWidth > 767 ){
            isDesktop = false;
            isTablet = true;
            isMobile = false;
        }else{
            isDesktop = false;
            isTablet = false;
            isMobile = true;
        }

        if((myWidth < 950 && myWidth > 768) || myWidth < 666){
            $('.b-addressee-desktop .b-addressee-left').text($('.b-addressee-desktop .b-addressee-left').attr("data-short"));
        }else{
            $('.b-addressee-desktop .b-addressee-left').text($('.b-addressee-desktop .b-addressee-left').attr("data-long"));
        }

        //менять положение кнопки над блоком/под блоком
        var $moveEl = $('.b-call').parents(".b-catalog").find(".b-btn-more");
        if(myWidth < 1200){
            $('.b-call').before($moveEl.parent());
        }else{
            $('.b-call').parents(".b-catalog-list").after($moveEl.parent());
        }

        if(isDesktop){
            $('.fancy-filter').unbind('click.fb-start');
            $('.b-filter-flowers-list, .b-filter-price-list').css("display", "block");
            //вынести корзину из меню
            if($('.b-basket-desktop .b-basket').length === 0)
                $('.b-basket-desktop').append($('.b-basket'));
        }else{
            fancyFilterInit();
            //перенести корзину в меню
            if($('.basket-menu .b-basket').length === 0)
                $('.basket-menu').append($('.b-basket'));
        }

        if(isTablet){
            if($('.b-catalog-sections-tablet').hasClass("slick-initialized")){
                $('.b-catalog-sections-tablet').slick('setPosition');
            }
            $('.b-basket-btn-cont').on('click', function(){
                $('.b-top-basket-mobile').click();
            });
        }else{
            $('.b-basket-btn-cont').off('click');
        }

        if(isMobile){
            if(prevWidth !== myWidth){
                //$('.b-time').after($('.b-email-input'));
                $('.b-filter').addClass("hide").removeClass("b-filter-mobile");
            }
            $('#date, #time').prop("disabled", true);
            $('#date-mobile').prop("disabled", false);

            $("body").on("touchstart", ".b-slideout-not-touch", function(){
                $("html").addClass("touch-locked");
            });
            $("body").on("touchend", function(){
                $("html").removeClass("touch-locked");
            });

            if($('.b-addressee').length){
                if($('.b-addressee-mobile .b-addressee-left').hasClass("active")){
                    $('#addressee-name, #addressee-phone').prop("disabled", true).parent().addClass("hide");
                }else{
                    $('#addressee-name, #addressee-phone').prop("disabled", false).parent().removeClass("hide");
                }
            }

            if(timerAdvantage){
                clearInterval(timerAdvantage);
            }else{
                $('.b-header-title-list .b-advantage-item').first().addClass("advantage-show");
            }
            timerAdvantage = setInterval(function() {
                changeItem();
            }, 3000);
        }else{
            $('#date, #time').prop("disabled", false);
            $('#date-mobile').prop("disabled", true);
            $('.b-filter').removeClass("hide b-filter-mobile");
            //$('.b-input-move').prepend($('.b-email-input'));
            if(timerAdvantage){
                $('.b-header-title-list .advantage-show').removeClass("advantage-show");
                clearInterval(timerAdvantage);
            }
            if($('.b-addressee').length){
                if($('.b-addressee-desktop .b-addressee-left').hasClass("active")){
                    $('#addressee-name, #addressee-phone').prop("disabled", false).parent().removeClass("hide");
                }else{
                    $('#addressee-name, #addressee-phone').prop("disabled", true).parent().addClass("hide");
                }
            }
        }
        
        checkMenu();
        $(window).scroll();
        footerToBottom();

        prevWidth = myWidth;
    }

    function changeItem(){
        var $next = $('.b-header-title-list .advantage-show').next();
        $('.b-header-title-list .advantage-show').removeClass("advantage-show");
        setTimeout(function(){
            if ($next.length){
                $next.addClass("advantage-show");
            }else{
                $('.b-header-title-list .b-advantage-item').first().addClass("advantage-show");
            }
        }, 500);
    }

    function fancyFilterInit(){
        $(".fancy-filter").each(function(){
            var $popup = $($(this).attr("href")),
                $this = $(this);
            $this.fancybox({
                padding : 0,
                content : $popup,
                touch: false,
                autoFocus : true,
                helpers: {
                    overlay: {
                        locked: true 
                    }
                },
                btnTpl : {
                    smallBtn   : '<button data-fancybox-close class="fancybox-close-small" title="Закрыть"></button>',
                },
            });
        });
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

    $(window).on('load', function(){
        checkMenu();
    });

    $(window).resize(resize);
    resize();

    checkMiniCart();

    updateCatalog();

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

    if( typeof autosize == "function" )
        autosize(document.querySelectorAll('textarea'));

    var slideoutLeft = new Slideout({
        'panel': document.getElementById('panel-page'),
        'menu': document.getElementById('mobile-menu'),
        'side': 'left',
        'padding': 300,
        'tolerance': 70
    });

    $('.burger-menu').click(function() {
        slideoutLeft.open();
        $('.basket-menu').addClass("hide");
        $('.mobile-menu').removeClass("hide");
        $('.b-menu-overlay').show();
        return false;
    });

    slideoutLeft.disableTouch();

    slideoutLeft.on('beforeopen', function() {
        slideoutLeft.enableTouch();
    }).on('beforeclose', function() {
        slideoutLeft.disableTouch();
        $(".b-menu-overlay").hide();
    }).on('close', function() {
        console.log("slideoutLeft");
        $(window).scroll();
    });

    var slideoutRight = new Slideout({
        'panel': document.getElementById('panel-page'),
        'menu': document.getElementById('basket-menu'),
        'side': 'right',
        'padding': 300,
        'tolerance': 70
    });

    $('.b-top-basket-mobile').click(function() {
        slideoutRight.open();
        $('.basket-menu').removeClass("hide");
        $('.mobile-menu').addClass("hide");
        $('.b-menu-overlay').show();
        return false;
    });

    slideoutRight.disableTouch();

    slideoutRight.on('beforeopen', function() {
        slideoutRight.enableTouch();
    }).on('beforeclose', function() {
        slideoutRight.disableTouch();
        $(".b-menu-overlay").hide();
    }).on('close', function() {
        console.log("slideoutRight");
        $(window).scroll();
    });

    $('.b-menu-overlay').on('click', function() {
        if(slideoutLeft.isOpen())
            slideoutLeft.close();
        if(slideoutRight.isOpen())
            slideoutRight.close();
        $(".b-menu-overlay").hide();
        return false;
    });

    $(".b-input-search").submit(function(){
        return false;
    });

    // var e = $('.b-menu-overlay, .mobile-menu, .basket-menu');
    // e.touch();
    // e.on('swipeLeft', function(event) {
    //     console.log("swipeLeft");
    //     /*$("body").bind("touchmove", function(e){
    //         console.log("touchmove");
    //         e.preventDefault();
    //         return false;
    //     });*/
    //     if(slideoutLeft.isOpen()){
    //         console.log("slideoutLeft.isOpen");
    //         slideoutLeft.close();
    //         $(".b-menu-overlay").hide();
    //     }
            
    // });
    // e.on('swipeRight', function(event) {
    //     console.log("swipeRight");
    //     /*$("body").bind("touchmove", function(e){
    //         console.log("touchmove");
    //         e.preventDefault();
    //         return false;
    //     });*/
    //     if(slideoutRight.isOpen()){
    //         slideoutRight.close();
    //         $(".b-menu-overlay").hide();
    //     }
    // });

    if(isRetina && !isMobile){
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
                //$this.css("background-image", 'url(' + $this.attr("data-back") + ')');
                $this.addClass("header-retina");
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

    $('.b-addition-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        infinite: true,
        arrows: false,
        speed: 600,
        autoplay: true,
        autoplaySpeed: 3000,
        adaptiveHeight: true,
        rows: 2,
        slidesPerRow: 3,
        responsive: [
            {
              breakpoint: 1200,
              settings: {
                rows: 2,
                slidesPerRow: 2,
              }
            },
            {
              breakpoint: 768,
              settings: {
                rows: 3,
                slidesPerRow: 1,
              }
            }
        ]
    });

    var $sectionActive = $('.b-catalog-sections-tablet li.active');
    $('.b-catalog-sections-tablet').on('init', function(event, slick){
        setTimeout(function(){
            console.log($('.b-catalog-sections-tablet li.active'));
            $('.b-catalog-sections-tablet').slick('slickGoTo', $sectionActive.attr("data-slick-index"), true);
        },10);
    });

    $('.b-catalog-sections-tablet').slick({
        dots: false,
        arrows: true,
        nextArrow: '<div class="icon-slider-right b-slider-arrows" aria-hidden="true"></div>',
        prevArrow: '<div class="icon-slider-left b-slider-arrows" aria-hidden="true"></div>',
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0px',
        speed: 600,
        responsive: [
            {
              breakpoint: 920,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
        ]
    });

    var arrowOffset = 0,
        footerOffset = 0;
    $(window).scroll(function (){
        var headerHeight = 0;
        if($('.b-header').length){
            headerHeight = $('.b-header').outerHeight(true);
        }else{
            headerHeight = $('.b-header-inner').outerHeight(true);
        }

        if ($(this).scrollTop() > headerHeight){
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
                $("#lb_button-wrapper").addClass("absolute").removeClass("fixed");
            }else{
                $('.arrow-up').css("position", "fixed");
                $("#lb_button-wrapper").addClass("fixed").removeClass("absolute");
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

     $('.icon-search').on('click', function(){
        $(".b-input-search").toggleClass("show");
        if($(".b-input-search").hasClass("show")){
            setTimeout(function() {
                $(".b-input-search input").focus();
            }, 310);
        }
        return false;
    });

    $(document).keyup(function(e){
        if(e.keyCode === 27)
            $(".b-input-search").removeClass("show");
    });

    $('.b-btn-filter').on('click', function(){
        $('.b-filter').toggleClass("hide");
        if(!$('.b-filter').hasClass("hide")){
            $('body,html').animate({
               scrollTop: $('.b-filter').offset().top - 40 - 53
            }, 300);
        }
        return false;
    });

    $("body").on("click", ".color-reset, .b-btn-reset", function(){
        $('.b-filter-colors input[type="checkbox"]').prop("checked", false);
        $(".any-prices").prop("checked", true);
        checkPrices();
        $(".any-flowers").prop("checked", true);
        $(".any-prices").prop("checked", true).change();
        return false;
    });

    var menuTimer = null;
    $(".b-catalog-menu-desktop ul > li > a").hover(function(){
        if($(this).parent().hasClass("active")){
            $(".b-catalog-menu-desktop .b-line").addClass("b-line-color");
        }else
            $(".b-catalog-menu-desktop .b-line").removeClass("b-line-color");
        clearTimeout(menuTimer);
        moveLine($(this));
    }, function(){
        clearTimeout(menuTimer);
        menuTimer = setTimeout(checkMenu, 300);
    });

    function checkMenu(){
        if( $(".b-catalog-menu-desktop ul > li.active > a").length ){
            moveLine($(".b-catalog-menu-desktop ul > li.active > a"));
            $(".b-catalog-menu-desktop .b-line").addClass("b-line-color");
        }else{
            $(".b-catalog-menu-desktop .b-line").removeClass("show");
        }
    }

    function moveLine($el){
        $(".b-catalog-menu-desktop .b-line").addClass("show").css({
            "left" : $el.position().left + parseInt($el.css("padding-left").replace(/\D+/g,"")),
            "width" : $el.width()
        });
    }

    checkMenu();

    $(".b-btn-pay").click(function(){
        $("#pay").submit();

        return false;
    });

    $('.b-catalog-menu-desktop ul > li').mousedown(function(eventObject){
        $(".b-catalog-menu-desktop .b-line").addClass("b-line-color");
    });
    $('.b-catalog-menu-desktop ul > li').mouseup(function(eventObject){
        $(".b-catalog-menu-desktop .b-line").removeClass("b-line-color");
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

    $('.b-addressee-desktop .b-addressee-switch').on('click', function(){
        if($('.b-addressee-desktop .b-addressee-left').hasClass("active")){//клик на самовывоз
            $("input[name='DELIVERY_ID']").val(3);
            $('.b-addressee-desktop .b-addressee-left').removeClass("active");
            $('.b-addressee-desktop .b-addressee-right').addClass("active");

            $('#addressee-name, #addressee-phone').prop("disabled", true).parent().addClass("hide");
            $('#address').prop({"disabled": true, "required": false}).removeClass("error");
            $('.b-address').addClass("hide");

            //$("label[for='date']").text("Дата самовывоза");
            //$("label[for='time']").text("Время самовывоза");

            //$(".b-email-input").after($(".b-payment-method"));
            $("#delivery-price").prop("disabled", true);
            $(".delivery-price").addClass("s-hide");

            $(".b-payment-method-item").addClass("hide");
            $("." + $('.b-addressee-right').attr("data-payment")).removeClass("hide");

            $('.b-addressee-mobile').addClass("hide");
        }else{//клик на доставку
            $("input[name='DELIVERY_ID']").val(2);
            $('.b-addressee-desktop .b-addressee-right').removeClass("active");
            $('.b-addressee-desktop .b-addressee-left').addClass("active");

            $('#addressee-name, #addressee-phone').prop("disabled", false).parent().removeClass("hide");
            $('#address').prop({"disabled": false, "required": true});
            if(!$('#address').val()){
                $('#address').addClass("error");
            }
            $('.b-address').removeClass("hide");

            //$("label[for='date']").text("Дата доставки");
            //$("label[for='time']").text("Время доставки");

            $(".b-for-payment").prepend($(".b-payment-method"));
            $("#delivery-price").prop("disabled", false);
            $(".delivery-price").removeClass("s-hide");

            $(".b-payment-method-item").addClass("hide");
            $("." + $('.b-addressee-left').attr("data-payment")).removeClass("hide");

            $('.b-addressee-mobile').removeClass("hide");
            if(isMobile && $('.b-addressee-mobile .b-addressee-left').hasClass("active")){
                $('.b-addressee-mobile .b-addressee-right').removeClass("active");
                $('.b-addressee-mobile .b-addressee-left').addClass("active");
                $('#addressee-name, #addressee-phone').prop("disabled", true).parent().addClass("hide");
            };
        }
        if( !$(".b-payment-method-item input:visible:checked").length ){
            $(".b-payment-method-item:not(.hide)").eq(0).find("input").prop("checked", true);
        }
        updateMiniCartSum();
        //if(!!$("#date").val()){
        //    $("#date").change();
        //}
        return false;
    });

    if($('.b-addressee-desktop .b-addressee-switch').length){
        $(".b-payment-method-item").addClass("hide");
        $("." + $('.b-addressee-desktop .b-addressee-left').attr("data-payment")).removeClass("hide");
    }

    $('.b-addressee-mobile .b-addressee-switch').on('click', function(){
        if($('.b-addressee-mobile .b-addressee-left').hasClass("active")){//клик на "Получателю"
            $('.b-addressee-mobile .b-addressee-left').removeClass("active");
            $('.b-addressee-mobile .b-addressee-right').addClass("active");
            $('#addressee-name, #addressee-phone').prop("disabled", false).parent().removeClass("hide");
        }else{//клик на "Доставить мне"
            $('.b-addressee-mobile .b-addressee-right').removeClass("active");
            $('.b-addressee-mobile .b-addressee-left').addClass("active");
            $('#addressee-name, #addressee-phone').prop("disabled", true).parent().addClass("hide");
        }
        return false;
    });

    var dateToday = new Date();
    if($('#date').length){
        $.datepicker.regional['ru'] = {
            closeText: 'Готово', // set a close button text
            currentText: 'Сегодня', // set today text
            monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'], // set month names
            monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'], // set short month names
            dayNames: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'], // set days names
            dayNamesShort: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'], // set short day names
            dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'], // set more short days names
            dateFormat: 'dd.mm.yy', // set format date
            firstDay: 1
        };        
        $.datepicker.setDefaults($.datepicker.regional["ru"]);

        $(function(){
            $("#date").datepicker({
                minDate: 0,
                beforeShow: function(input, inst) {
                    var calendar = inst.dpDiv;
                    setTimeout(function(){
                        $('.ui-datepicker').css('z-index', 100);
                        if(isMobile){
                            calendar.position({
                                my: 'left top',
                                at: 'left bottom',
                                collision: 'none',
                                of: input
                            });
                        }
                    }, 10);
                },
                onClose: function(){
                    setTimeout(function(){
                        if(!$("#date").val()){
                            $("#date").parent().removeClass("focus not-empty");
                        }
                    }, 10);
                }
            }).on("change", function(){
                $(this).parents(".b-input").addClass("not-empty");

                var dateSelect = $("#date").datepicker("getDate");
                resetTime();
                if(dateSelect){
                    if(dateToday.getDate() === dateSelect.getDate() &&
                        dateToday.getMonth() === dateSelect.getMonth() &&
                        dateToday.getFullYear() === dateSelect.getFullYear())
                    {
                        checkDeliveryTime(true);
                    }else if(dateToday.getDate() + 1 === dateSelect.getDate() &&
                        dateToday.getMonth() === dateSelect.getMonth() &&
                        dateToday.getFullYear() === dateSelect.getFullYear())
                    {
                        checkDeliveryTime(false);
                    }

                    //проверить доступно ли время для этой даты
                    if($('input[name="time-select"]:checked').length && 
                        $('input[name="time-select"]:checked').hasClass("no-active")){
                        $('input[name="time-select"]:checked').prop("checked", false);
                        setFirstTime();
                    }
                    $('#time').focus();
                    $('.b-date-time .b-time').css("left", $('#date').css("width"));
                }
            });
        });
    }

    //поставить первое доступное время
    function setFirstTime(){
        $firstTime = $('input[name="time-select"]:not(.no-active):first');
        $firstTime.prop("checked", true);
        $('.input-time').val($firstTime.siblings("label").text());
    }

    function resetTime(){
        $('input[name="time-select"]').each(function(){
            $(this).removeClass("no-active").prop("disabled", false);
        });
    }

    /*if(isMobile)
        $.datepicker._checkOffset = function(_, offset){ return offset; };*/

    //проверить, валидно ли время
    $('.input-time').blur(function(){
        if(!!$(this).val()){
            var time = $(this).val().split(':');
            var hour = parseInt(time[0]);
            if(hour < workDay.from){
               setFirstTime();
            }else if(hour >= workDay.from && hour <= workDay.to){
                if(!!hour && $('.b-time-list input[data-hour="'+hour+'"]').hasClass("no-active")){
                    setFirstTime();
                }
            }else{
                $lastTime = $('input[name="time-select"]:not(.no-active):last');
                $lastTime.prop("checked", true);
                $('.input-time').val($lastTime.siblings("label").text());
            }
        }
        $('.b-time-list').removeClass("show");
        if(!$('.input-time').val()){
            $(".b-time").removeClass("focus not-empty");
        }
        $('.icon-clock').addClass("hide");
        $('.icon-calendar').removeClass("hide");
    });

    $('#date').blur(function(){
        //$("#date").datepicker("hide");
        if(!$("#date").val()){
            $("#date").parent().removeClass("focus not-empty");
        }
    });

    $('body').on("click", ".b-filter-price-select, .b-filter-flowers-select", function(){
        return false;
    });

    $('.b-filter-price-list input:radio').change(checkPrices);

    $(".b-filter-flowers-list input:not(.any-flowers)").change(checkFlowers);

    checkPrices();

    checkFlowers();

    $(".any-flowers").change(function(){
        if( $(this).prop("checked") ){
            $(".b-filter-flowers-list input:not(.any-flowers)").prop("checked", false);
            $(".b-filter-flowers-select").text($(".b-filter-flowers-select").attr("data-default"));
            $(this).prop("disabled", true);
        }
    });

    function checkFlowers(){
        var count = $(".b-filter-flowers-list input:not(.any-flowers):checked").length;
        if(count > 0){
            $(".b-filter-flowers-select").text("Выбрано " + count + " шт.");
            $(".any-flowers").prop("checked", false).prop("disabled", false);
        }else{
            $(".b-filter-flowers-select").text($(".b-filter-flowers-select").attr("data-default"));
            $(".any-flowers").prop("checked", true).prop("disabled", true);
        }
    }

    function checkPrices(){
        $('.b-filter-price-select').text($(".b-filter-price-list input:radio:checked").siblings("label").text());
        $('.b-filter-price-list').removeClass("show");
        $('.b-filter-price-select.icon-arrow-down').removeClass("arrow-rotate");
    }

    function ajaxFilter(){
        var url = window.location.href;
        $.ajax({
            type: "GET",
            url: url,
            data: { partial : true },
            success: function(msg){
                $(".b-catalog:not(.b-catalog:first), .b-questions").remove();
                $(".b-catalog .b-block").html(msg);

                updateCatalog();
            },
            error: function(){
                
            }
        });
    }

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
        if ($(event.target).closest(".b-time").length) 
            return;
        else{
            $('.b-time-list').removeClass("show");
            //if(!$('.input-time').val()){
            //    $(".b-time").removeClass("focus not-empty");
            //}
        }
        if ($(event.target).closest(".b-input-search").length) 
            return;
        else{
            $('.b-input-search').removeClass("show");
        }
        event.stopPropagation();
      });
    });

    if($('.b-date-time').length){
        Plugins.AutosizeInput.getDefaultOptions().space = 0;
        $('#date').autosizeInput();
        $('#time').on('click focus', function(){
            //если дата выбрана
            if(!!$('#date').val()){
                $('.b-time-list').addClass("show");
                $('.icon-clock').removeClass("hide");
                $('.icon-calendar').addClass("hide");
            }else{
                $('#date').datepicker("show");
                $('.icon-clock').addClass("hide");
                $('.icon-calendar').removeClass("hide");
            }
        });

        $(document).on('keydown', function(e){
            var code = (e.keyCode || e.which);
            //влево
            if(code == 37 || code == 38) {
                //получить положение каретки, если она в начале time, то передвинуть фокус на дату
                if($('#time:focus').length && getCaret(document.getElementById("time")) === 0){
                    $('#time').blur();
                    $('#date').focus();
                }
            }
            //вправо
            if(code == 39 || code == 40) {
                 //получить положение каретки, если она в конце date, то передвинуть фокус на время
                if($('#date:focus').length && getCaret(document.getElementById("date")) === $('#date').val().length){
                    $('#date').datepicker("hide").blur();
                    $('#time').focus();
                }
            }
        });
    }

    function getCaret(el) { 
      if (el.selectionStart) { 
        return el.selectionStart; 
      } else if (document.selection) { 
        el.focus(); 
     
        var r = document.selection.createRange(); 
        if (r == null) { 
          return 0; 
        } 
     
        var re = el.createTextRange(), 
            rc = re.duplicate(); 
        re.moveToBookmark(r.getBookmark()); 
        rc.setEndPoint('EndToStart', re); 
     
        return rc.text.length; 
      }  
      return 0; 
    }

    $('#date').on('click focus', function(){
        console.log("date-focus");
        $('.icon-clock').addClass("hide");
        $('.icon-calendar').removeClass("hide");
    });

    $('#date').on('input', function(){
        if(!$(this).val()){
            $("#time").val("");
        }
        $('.b-date-time .b-time').css("left", $('#date').css("width"));
    });

    $(".b-time-list input").change(function(){
         $('.input-time').val($(this).siblings("label").text());
         $('.b-time-list').removeClass("show");
    });

    if(isMobile){
        new FastClick(document.body);
        $(".b-time-list label").on('click', function(){
            if(!$(this).siblings("input").hasClass("no-active")){
                $('.input-time').val($(this).text());
                $('.b-time-list').removeClass("show");
            }
        });
    }

    var workDay = {
        from : 8,
        to : 22,
    };
    var hoursDelivery = 0,
        dayDelivery;

    function checkDeliveryTime (isToday) {
        var bouquetTime = parseInt($('.input-time').attr("data-hour"));//время сбора букета (в часах)
            dayDelivery = dateToday.getDate(),
            hours = dateToday.getHours(),
            minutes = dateToday.getMinutes();

        if(minutes > 20){
            hours++;
        }

        if(isToday){
            if(hours + bouquetTime > workDay.to){
                //заблочить сегодняшний день
                $("#date").datepicker({minDate: '1'});
                dayDelivery++;
                //пересчитываем время на следующий день
                hoursDelivery = hours - workDay.to + workDay.from + bouquetTime;
            }else if( hours < workDay.from ){
                hoursDelivery =  workDay.from + bouquetTime;
            }else{
                hoursDelivery =  hours + bouquetTime;
            }

            $('input[name="time-select"]').each(function(){
                $this = $(this);
                if(parseInt($this.attr("data-hour")) < hoursDelivery){
                    $this.addClass("no-active").prop("disabled", true);
                }
            });
        }else{
            hoursDelivery = hours - workDay.to + workDay.from + bouquetTime;
            $('input[name="time-select"]').each(function(){
                $this = $(this);
                if(parseInt($this.attr("data-hour")) < hoursDelivery){
                    $this.addClass("no-active").prop("disabled", true);
                }
            });
        }
    }

    if($('.b-time').length){
        checkDeliveryTime(true);
    }

    if($('#date-mobile').length){
        $('#date-mobile').mobiscroll().datetime({
            theme: 'ios',
            display: 'bottom',
            lang: 'ru',
            minDate: new Date(dateToday.getFullYear(), dateToday.getMonth(), dayDelivery, hoursDelivery),
            invalid: [
                { start: '00:00', end: '07:59' },
                { start: '22:30', end: '23:59' },
            ],
            stepMinute: 30,
            dateOrder: 'ddMyy',
        });
    }

    $('.b-btn-address').on('click', function(){
        if($('.js-order-adress-map-input').attr("valid-delivery") &&
            !!$('.js-order-adress-map-input').val()){
                var room = "";
                if(!isNaN($('.js-order-adress-map-price').text()))
                    $('.delivery-price-value').addClass("icon-ruble");
                else
                    $('.delivery-price-value').removeClass("icon-ruble");
                if(!!$('.number-room-input').val()){
                    room = ", кв. ";
                }
                var resString = $('.js-order-adress-map-input').val() + room + $('.number-room-input').val();
                $(".choose-address-value").text(resString);
                $('.b-choose-address, .choose-address-change #address').removeClass("error");
                $('.choose-address-change #address').val(resString);
                $('.delivery-price-value').text($('.js-order-adress-map-price').text())
                    .parent().removeClass("hide");
                $("#delivery-price").val($('.js-order-adress-map-price').text().replace(/[^0-9\.]+/g,"")*1);
                $('.choose-address-action').text("изменить");
                $.fancybox.close(); 
            }else{
                $(".choose-address-value").text("");
                $('.b-choose-address, .choose-address-change #address').addClass("error");
                $('.js-order-adress-map-input').addClass("error").parent().addClass("error");
                $('.choose-address-change #address').val("");
                $('.delivery-price-value').text("").parent().addClass("hide");
                $("#delivery-price").val("");
                $('.choose-address-action').text("указать адрес");
            }
        updateMiniCartSum();
        return false;
    });

    if($('.b-map').length){
        var myPlace = new google.maps.LatLng(56.463328, 84.966415);
        var myOptions = {
            zoom: 17,
            center: myPlace,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            scrollwheel: false,
            zoomControl: true
        }
        var map = new google.maps.Map(document.getElementById("b-map"), myOptions);
        //var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
            //map.mapTypes.set('map_style', styledMap);
            //map.setMapTypeId('map_style');

        var marker = new google.maps.Marker({
            position: myPlace,
            map: map,
            icon: {
                url: "/bitrix/templates/main/html/i/pin.svg",
                scaledSize: new google.maps.Size(40, 58), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(17,53), // anchor
            },
            title: "Магазин"
        });
    }

    // Добавление в корзину
    var cartTimeout = 0;
    $("body").on("click",".b-btn-to-cart",function(){
        var url = $(this).attr("href");

        if( $("input[name=quantity]").length ){
            url = url + "&quantity=" + $("input[name=quantity]").val();
        }
        clearTimeout(cartTimeout);

        checkMiniCart();

        if( $(".b-basket-table").length ){
            $("body, html").animate({
                scrollTop : $(".b-basket-table").offset().top - $(".b-fixed-back").height() - 20
            }, 300);    
        }

        $.ajax({
            type: "GET",
            url: url,
            success: function(msg){
                if( $(msg).find(".b-basket-table").length ){
                    $(".b-basket").html($(msg).find(".b-basket").html());
                    $(".b-for-basket").html($(msg).find(".b-basket-table"));
                }else{
                    $(".b-basket").html($(msg).find(".b-basket").html());

                    $(".b-basket-btn-cont").addClass("show");

                    cartTimeout = setTimeout(function(){
                        $(".b-basket-btn-cont").removeClass("show");
                    }, 2000);
                }
                updateMiniCartSum();

                $(".b-basket-btn-total").text( $(".b-basket-total").text() );

                checkMiniCart();
            },
            error: function(){
                alert("Ошибка добавления в корзину");
            }
        });

        if( $(".b-top-basket-mobile:visible").length ){
            $(".b-basket ul").html("<li class='b-preload-cart'><img src=\"/bitrix/templates/main/html/i/preload.svg\" alt=\"\" class=\"b-svg-preload b-svg-preload-popup\"></li>");

            if( !$(".b-basket-table").length ){
                $(".b-top-basket-mobile").click();
            }else{
                $("body, html").animate({
                    scrollTop : $(".b-inner-cart").offset().top-53
                }, 300);
            }
        }

        return false;
    });

    // Удаление из корзины
    var cartTimeout = 0,
        deleteCount = 0;
    $("body").on("click",".b-btn-remove-from-cart",function(){
        var url = $(this).attr("href"),
            $item = $(".b-cart-item[data-id='"+$(this).parents("li, tr").attr("data-id")+"']");

        $item.hide().addClass("hidden");

        updateMiniCartSum();

        if( $(".b-basket-table").length && $(".b-basket-table tr:not(.hidden)").length <= 1 ){
            $(".b-cart-empty").show();
            $(".b-basket-table, .b-data-order, .b-addition").hide();
        }

        if( $(".b-top-basket-mobile:visible").length && !$(".b-basket li:not(.hidden)").length ){
            $(".b-basket ul").append("<li class=\"b-preload-cart\">Ваша корзина пуста.</li>");
        }

        deleteCount++;

        $.ajax({
            type: "GET",
            url: url,
            success: function(msg){
                var reg = /<!--([\s\S]*?)-->/mig;
                msg = msg.replace(reg, "");
                var json = JSON.parse(msg);

                deleteCount--;

                if( json.result == "success" ){
                    $item.remove();
                    
                    if( deleteCount == 0 )
                        $(".b-basket-btn-total, .b-basket-total").text( json.sum );
                }else{
                    alert("Ошибка удаления из корзины");
                    $item.show().removeClass("hidden");
                    $(".b-cart-empty").hide();
                    $(".b-basket-table").show();
                    $(".b-basket").find(".b-preload-cart").remove();
                }
                console.log(json);
            },
            complete: function(){
                setTimeout(checkMiniCart, 10);
            },
            error: function(){
                alert("Ошибка удаления из корзины");
                $item.show().removeClass("hidden");
                $(".b-cart-empty").hide();
                $(".b-basket-table").show();
                $(".b-basket").find(".b-preload-cart").remove();
            }
        });

        return false;
    });

    // Изменение количества в корзине по кнопкам
    $("body").on("click", ".b-change-quantity", function(){
        var $input = $(this).parents(".input-cont").find("input"),
            quantity = $input.val()*1,
            side = $(this).attr("data-side");

        if( (quantity == 1 && side == "-") || (quantity == maxBasketCount && side == "+") ){
            return false;
        }

        quantity = (side == "+")?(quantity+1):(quantity-1);
        
        $input.val(quantity).change();

        return false;
    });

    // Изменение количества в корзине путем ввода
    $("body").on("change", ".b-quantity-input", function(){
        var url = $(this).parents(".input-cont").find(".icon-minus").attr("href"),
            $item = $(".b-cart-item[data-id='"+$(this).parents("li, tr").attr("data-id")+"']"),
            $input = $(this),
            quantity = $input.val()*1;

        quantity = ( quantity < 1 )?1:quantity;
        quantity = ( quantity > maxBasketCount )?maxBasketCount:quantity;
        
        $input.val(quantity);
        $item.find("p.b-basket-item-count").text(quantity+" шт.");
        $item.find("select.b-basket-item-count").val(quantity);

        updateMiniCartSum();

        ajaxChangeQuantity(url, quantity);
    });

    // Изменение количества в мобильной корзине
    $("body").on("change", "select.b-basket-item-count", function(e, tog){
        var $item = $(this).parents(".b-cart-item"),
            $select = $(this),
            quantity = $select.val()*1,
            $input = $item.find(".b-quantity-input");
        
        $input.val(quantity).change();
    });

    $("#b-filter-form input").change(function(){
        History.replaceState(null , null, (($(".b-content.main").length)?"/catalog/":"")+"?"+$("#b-filter-flowers-list input, #b-filter-price-list input, .b-filter-colors input, .b-filter-other input").serialize());

        ajaxFilter();
    });

    $(".b-mobile-filter").click(function(){
        // ajaxFilter();

        $.fancybox.close();
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
                count = $(this).find("p.b-basket-item-count").text().replace(/[^0-9\.]+/g,"")*1;

            sum += (price*count);
        });

        $(".b-basket-table .b-cart-item").each(function(){
            var price = $(this).find(".b-basket-price").text().replace(/[^0-9\.]+/g,"")*1,
                count = $(this).find(".b-quantity-input").val().replace(/[^0-9\.]+/g,"")*1;

            $(this).find(".b-basket-sum h4").text( ((price*count)+"").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') );
        });

        $(".b-basket-btn-total, .b-basket-total").text( (sum+"").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') );

        if( $(".delivery-price:not(.hide):not(.s-hide)").length ){
            sum += ($(".delivery-price-value").text().replace(/[^0-9\.]+/g,"")*1);
        }
        $(".total-price-value").text( (sum+"").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') );

        checkMiniCart();
    }

    function ajaxChangeQuantity(url, quantity){
        if( typeof countQueue[url] == "undefined" ){
            countQueue[url] = 0;
        }
        countQueue[url]++;

        $.ajax({
            type: "GET",
            url: url,
            data: { QUANTITY : quantity },
            success: function(msg){
                var reg = /<!--([\s\S]*?)-->/mig;
                msg = msg.replace(reg, "");
                var json = JSON.parse(msg);

                countQueue[url]--;

                console.log([json.id, json.quantity]);

                if( json.result == "success" ){
                    if( countQueue[url] == 0 ){
                        // console.log([json.id, json.quantity]);
                        $(".b-cart-item[data-id='"+json.id+"'] input").val(json.quantity);
                        $(".b-cart-item[data-id='"+json.id+"'] p.b-basket-item-count").text(json.quantity+" шт.");

                        updateMiniCartSum();
                    }
                }else{
                    alert("Ошибка изменения количеста, пожалуйста, обновите страницу");
                }
            },
            error: function(){
                countQueue[url]--;
            }
        });
    }
});