$(function() {
  if($('.dot').length){$('.dot').dotdotdot({watch:true});};
  if($('.imgLiquidFill').length){$('.imgLiquidFill').imgLiquid({fill:true});};
  if($('input[type=tel]').length){$('input[type=tel]').mask('+9(999) 999-9999');};
  if($('.modal-toggle').length){$('.modal-toggle').magnificPopup({removalDelay:500,callbacks:{beforeOpen:function(){this.st.mainClass = this.st.el.attr('data-effect');}}});};
  if($('.welcome-slider').length){var swiper = new Swiper('#slider-1',{nextButton:'#slider-1 .swiper-button-next',prevButton:'#slider-1 .swiper-button-prev',loop:true,autoplay:4200,autoHeight:true});};
  if($('.reviews').length){var swiper = new Swiper('#slider-2',{nextButton:'#slider-2 .swiper-button-next',prevButton:'#slider-2 .swiper-button-prev',loop:true,autoplay:4200});};
  if($('.snipper-vertical').length){$('.snipper-vertical').TouchSpin({verticalbuttons:true, min:1, max:999});};
  $('.wok .section-1, .wok .section-2').find('.item').on('click', function(){$(this).addClass('active').siblings('.item').removeClass('active');});
  $('.wok .section-3').find('.item').on('click', function(){$(this).toggleClass('disabled').toggleClass('active'); $fn= $(this).find('input[type=checkbox]'); $fn.prop('checked', !($fn.is(':checked')));});
  $('.wok .section-4, .wok .section-5').find('.item').on('click', function(){$(this).toggleClass('active'); $fn= $(this).find('input[type=checkbox]'); $fn.prop('checked', !($fn.is(':checked')));});
  $(window).on('load resize', function() {var y= $('.page-header').outerHeight(); $('.page-body').css('padding-top',y);});
});