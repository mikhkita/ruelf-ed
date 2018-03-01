function getNextField($form){
	var j = 1;
	while( $form.find("input[name="+j+"]").length ){
		j++;
	}
	return j;
}

function fancyOpen(el){
    $.fancybox(el,{
    	padding:0,
    	fitToView: false,
        scrolling: 'no',
        beforeShow: function(){
			$(".fancybox-wrap").addClass("beforeShow");
			if( !device.mobile() ){
		    	$('html').addClass('fancybox-lock'); 
		    	$('.fancybox-overlay').html($('.fancybox-wrap')); 
		    }
		},
		afterShow: function(){
			$(".fancybox-wrap").removeClass("beforeShow");
			$(".fancybox-wrap").addClass("afterShow");
			setTimeout(function(){
                $('.fancybox-wrap').css({
                    'position':'absolute'
                });
                $('.fancybox-inner').css('height','auto');
            },200);
		},
		beforeClose: function(){
			$(".fancybox-wrap").removeClass("afterShow");
			$(".fancybox-wrap").addClass("beforeClose");
		},
		afterClose: function(){
			$(".fancybox-wrap").removeClass("beforeClose");
			$(".fancybox-wrap").addClass("afterClose");
		},
    }); 
    return false;
}

var customHandlers = [];

$(document).ready(function(){	
	var rePhone = /^\+\d \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
		tePhone = '+7 (999) 999-99-99';
		reDates = /^\d{2}.\d{2}.\d{4}$/,
		teDates = '99.99.9999',
		reTime = /^\d{2}:\d{2}$/,
		teTime = '99:99';

	$.validator.addMethod('customPhone', function (value) {
		return rePhone.test(value);
	});

	$(".ajax, .not-ajax").parents("form").each(function(){
		$(this).validate({
			onkeyup: ($(this).hasClass("b-sub-form"))?false:true,
			rules: {
				email: 'email',
				ORDER_PROP_2: 'email',
				phone: 'customPhone',
				ORDER_PROP_3: 'customPhone',
			},
			errorElement : "span",
			highlight: function(element, errorClass) {
			    $(element).addClass("error").parents(".b-input").addClass("error");
			},
			unhighlight: function(element) {
			    $(element).removeClass("error").parents(".b-input").removeClass("error");
			}
		});
		if( $(this).find("input[name=phone], input[name=addressee-phone], input[name=ORDER_PROP_3], input[name=ORDER_PROP_8]").length ){
			$(this).find("input[name=phone], input[name=addressee-phone], input[name=ORDER_PROP_3], input[name=ORDER_PROP_8]").mask(tePhone,{placeholder:" "});
		}
		if( $(this).find("#date").length ){
			$(this).find("#date").mask(teDates,{placeholder:"_"});
		}
		if( $(this).find("#time").length ){
			$(this).find("#time").mask(teTime,{placeholder:"_"});
		}
		if( !$(this).hasClass("b-sub-form") ){
			$(this).find("input[type='text'], input[type='email'], textarea, select").blur(function(){
			   $(this).valid();
			});

			$(this).find("input[type='text'], input[type='email'], textarea, select").keyup(function(){
			   $(this).valid();
			});
		}
	});

	$('.order-adress-map-form').validate({
		onkeyup: true,
		rules: {
			email: 'email',
			phone: 'customPhone'
		},
		errorElement : "span",
		highlight: function(element, errorClass) {
		    $(element).addClass("error").parents(".b-input").addClass("error");
		},
		unhighlight: function(element) {
		    $(element).removeClass("error").parents(".b-input").removeClass("error");
		}
	});
	$('.order-adress-map-form').find("input[type='text'], input[type='email'], textarea, select").blur(function(){
	   $(this).valid();
	});
	$('.order-adress-map-form').find("input[type='text'], input[type='email'], textarea, select").keyup(function(){
	   $(this).valid();
	});

	function whenScroll(){
		var scroll = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
		if( customHandlers["onScroll"] ){
			customHandlers["onScroll"](scroll);
		}
	}
	$(window).scroll(whenScroll);
	whenScroll();

	var open = false;
    $("body").on("mouseup", ".b-popup *, .b-popup, .b-filter-flowers-list, .b-filter-price-list", function(){
        open = true;
    });
    $("body").on("mousedown", ".fancybox-slide", function() {
        open = false;
    }).on("mouseup", ".fancybox-slide", function(){
        if( !open ){
            $.fancybox.close();
        }
    });

	$(".b-go").click(function(){
		var block = $( $(this).attr("data-block") ),
			off = $(this).attr("data-offset")||0,
			duration = $(this).attr("data-duration")||800;
		$("body, html").animate({
			scrollTop : block.offset().top-off
		},duration);
		return false;
	});

	$(".fancy-img").fancybox({
		padding : 0,
		hash : false,
		touch : false,
		clickContent : false,
		buttons : [
	        'fullScreen',
	        'close'
	    ],
	});

	$(".goal-click").click(function(){
		if( $(this).attr("data-goal") && typeof yaCounter47641909 != "undefined" )
			yaCounter47641909.reachGoal($(this).attr("data-goal"));
	});

	$(".ajax, .not-ajax").parents("form").submit(function(){
		if( $(this).hasClass("blocked") )
			return false;

		if($(this).find(".b-choose-address input.error").length){
			$('.b-choose-address').addClass("error");
		}
  		if( $(this).find("input.error,select.error,textarea.error").length == 0 ){
  			$(this).addClass("blocked");

  			if( $(this).find(".not-ajax").length ) return true;

  			var $this = $(this),
  				$thanks = $($this.attr("data-block"));

  			$this.find(".ajax").attr("onclick", "return false;");

  			if( $this.attr("data-beforeAjax") && customHandlers[$this.attr("data-beforeAjax")] ){
				customHandlers[$this.attr("data-beforeAjax")]($this);
			}

			if( $this.attr("data-goal") && typeof yaCounter47641909 != "undefined" ){
				yaCounter47641909.reachGoal($this.attr("data-goal"));
			}

  			$.ajax({
			  	type: $(this).attr("method"),
			  	url: $(this).attr("action"),
			  	data:  $this.serialize(),
				success: function(msg){
					var $form;
					if( msg == "1" ){
						$link = $this.find(".b-thanks-link");
					}else{
						$link = $(".b-error-link");
					}

					if( $this.attr("data-afterAjax") && customHandlers[$this.attr("data-afterAjax")] ){
						customHandlers[$this.attr("data-afterAjax")]($this);
					}

					$.fancybox.close();
					$link.click();
				},
				error: function(){
					$.fancybox.close();
					$(".b-error-link").click();
				},
				complete: function(){
					$this.find(".ajax").removeAttr("onclick");
					$this.find("input[type=text],textarea").val("");
					$this.removeClass("blocked");
				}
			});
  		}else{
  			$(this).find("input.error,select.error,textarea.error").eq(0).focus();
  		}
  		return false;
  	});

	$("body").on("click", ".ajax, .not-ajax", function(){
		$(this).parents("form").submit();
		return false;
	});
});