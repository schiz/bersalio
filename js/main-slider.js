/*(function( $ ) {
	jQuery.fn.baseSlider = function() {

	  	var slider = {
			slideCount: this.find($('.slider-item')).length,
			switcherListen: $('.slider-switcher'),
			switcherObject: '<div class="switcher-item"></div>'
		};

		while (slider.slideCount--) {
			$(slider.switcherObject).appendTo(slider.switcherListen);
		}

		slider.switcherListen.find('.switcher-item:first').addClass('on');

		$('.switcher-item').on('click', function() {
			if ($(this).hasClass('on')) {
				return;
			}

			var currentIndex = $(this).index();

			$('.switcher-item').removeClass('on')
							 .eq(currentIndex).addClass('on');

			$('.slider-item.active').fadeOut(300,function(){
				$(this).removeClass('active');	
				
				$('.slider-item').eq(currentIndex).fadeIn(300,function(){
					$(this).addClass('active');
				});
			})
		})
	};
})(jQuery);*/