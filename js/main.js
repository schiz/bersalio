jQuery(document).ready(function($) {

	var Site = {
		baseFilterItems:  $('.base-filter .nav-item > a'),
		baseFilterLabel: $('.extended-filter .filter-label a'),
		selectingList: $('.selecting-list')
	};

	// Placeholder for bad browzers
	placeholderImplementation();

	function placeholderImplementation () {
		try {
			prettyPrint();
		} catch(err) {}
		
		$(":input[placeholder]").placeholder();
	}



	// preventDefault Links
	$('a.inner').on('click', function(event) {
		event.preventDefault();
	});



	// Open popup
	$('.call-modal').on('click', function (event) {
		event.stopPropagation();

		var href,
			way,
			wayArray,
			popupId,
			popupPart,

			noDataHref = $(this).attr('href'),
			dataHref = $(this).data('href');

		if (typeof noDataHref !== 'undefined' && noDataHref !== false) {
			href = noDataHref;
		} else if (typeof dataHref !== 'undefined' && dataHref !== false) { 
			href = dataHref;
		} else {
			return;
		}

		way = href.replace(/_/g, " ."),
		wayArray = way.split(' '),
		popupId = wayArray[0],
		popupPart = wayArray[1];

		$(wayArray[0]).find('.popupPart').hide();
		$(wayArray[0]).find(wayArray[1]).show();
		$(wayArray[0]).modal();
	});

	$('.modalCloseImg').on('click', function (event) {
		event.stopPropagation();
		$('.popup').hide();
		$.modal.close();
		$('.popup .popup-part').hide();
	});

	$('body').on('click', '#simplemodal-overlay', function (event) {
		$('.popup').hide();
		$('.popup .popup-part').hide();
		$.modal.close();
	});



	// Login / Registration switch
	$('#access-panel .login .navigation-link').on('click', function (argument) {
		var self = $(this).parents('.inner-wrapper');

		$(this).parents('.inner-wrapper').find('.login').fadeOut(150,function(){
			self.find('.registration').fadeIn(150,function(){
				$(this).show();
			});
		});
	});

	$('#access-panel .registration .navigation-link').on('click', function (argument) {
		var self = $(this).parents('.inner-wrapper');

		$(this).parents('.inner-wrapper').find('.registration').fadeOut(150,function(){
			self.find('.login').fadeIn(150,function(){
				$(this).show();
			});
		});
	});





	// Base filter items
	Site.baseFilterItems.hover(
		function () { $(this).parents('.nav-item').addClass('hover'); },
		function () { $(this).parents('.nav-item').removeClass('hover'); }
	);



	// Filter Label
	Site.baseFilterLabel.on('click', function(event) {
		if ($(this).parent().hasClass('open')) {
			var e = $(this);

			resetSelectedItemHandler();
		}

		var extFilter = $(this).parents('.extended-filter');

		baseFilterHandler(extFilter);

	});

	function baseFilterHandler(extFilter) {

		extFilter.find('.innder-wrapper').fadeToggle(400, function () {
			$(this).parents().find('.filter-label').toggleClass('open');
		});

	}



	//Count field. Count controller
	var countWrapper = '.count-field-wrapper',
		countWrapperObject = $(countWrapper);
		/*countWrapperData = function () {
			var minCount = $(countWrapper + '.field').data('min'),
				maxCount = $(countWrapper + '.field').data('max');

			return minCount, maxCount;
		};*/

	//Input focus
	$(countWrapper + ' .field').on('focus', function (event) {
		var el = $(this);

		el.val('');
		el.parent().addClass('focus');
	})

	.on('blur', function (event) {
		$(this).parent().removeClass('focus');
	})

	.on('keydown', function (event) {
		var isDigit = /\d/.test(String.fromCharCode(event.keyCode));

		var BACKSPACE = 8;

		if (!isDigit && !(event.keyCode === BACKSPACE)) {
			return false;
		}

	})

	.on('change', function (event) {
		var focusElement = $(this),
			focusElementMin = focusElement.data('min'),
			focusElementMax = focusElement.data('max');
		
		if ($(this).val() < focusElementMin) {

			$(this).attr('value', focusElementMin);
			$(this).val(focusElementMin);

		}
		else if ($(this).val() > focusElementMax) {

			$(this).attr('value', focusElementMax);
			$(this).val(focusElementMax);

		} else {

			$(this).attr('value', $(this).val());

		}

		culcItemCost(focusElement);
		culcTotalCost();
	});
	


	//Add or Remove one
	$(countWrapper + ' .cout-controller').on('click', function (event) {
		var el = $(this),
			self = $(this).siblings().find('.field');
			currentCount = ($(this).siblings().find('.field').attr('value'))|0;

		if ($(this).hasClass('less')) {
			if (currentCount === 1) {
				return;
			}
			else {
				currentCount--;
				saveValue(self, currentCount);
			}
		}
		else /* if $(this).hasClass('more') */ {
			if (currentCount === 99) {
				return;
			}
			else {
				currentCount++;
				saveValue(self, currentCount);
			}
		}

		//Save data
		function saveValue (self, currentCount) {
			self.attr('value', currentCount)
				.val(currentCount);
		}

		culcItemCost(self);
		culcTotalCost();
	});

	function culcItemCost (self) {
		var itemPrice = parseInt(self.parents('tr').find('.price > .value').text().replace(/ /g, "")), /*ALERT!!!*/
			itemCount = self.attr('value'),
			itemCost = formatCost(itemPrice * itemCount);

			self.parents('tr').find('.cost > .value').text(itemCost);
	}

	function culcTotalCost () {
		var items = $('table.results-table tr'),
			totalCost = 0;

		if ($('table.results-table tr td.cost > .value').length > 0) {
			items.each(function (i, item) {
				if (i > 0) {
					totalCost += parseInt($(this).find('td.cost > .value').text().replace(/ /g, ""));
				}

			});
		}

		$('.total-cost .value').text(formatCost(totalCost));
	}

	function formatCost(str) {
	    var amount = new String(str);
	    amount = amount.split("").reverse();

	    var output = "";
	    for ( var i = 0; i <= amount.length-1; i++ ){
	        output = amount[i] + output;
	        if ((i+1) % 3 == 0 && (amount.length-1) !== i)output = ' ' + output;
	    }
	    return output;
	}



	// Selecting list
	Site.selectingList.find('.selected-value').on('click', function(event) {
		event.stopPropagation();

		var el = $(this).parent();

		if (el.hasClass('on')) {
			resetSelectedItemHandler();
		} else {
			resetSelectedItemHandler();
			selectedItemHandler(el);
		}
	});
	Site.selectingList.find('.select-list-item').on('click', function(event) {
		var depress = $(this),
			el = $(this).parents('.selected-item');
		
		recordSelectedValues(depress);
		selectedItemHandler(el);
	});

	$('html').on('click', function(event) {
		$('.selected-item.on').removeClass('on');
	});

	function selectedItemHandler(el) {

		if (el.hasClass('on')) {
			el.removeClass('on')
		} else {
			el.addClass('on');
		}

	}

	function resetSelectedItemHandler() {
		if ($('.selected-item.on').length > 0) {
			$('.selected-item.on').removeClass('on');
		}
	}

	function recordSelectedValues(depress) {
		var selectedValueViewer = depress.parent().siblings('.selected-value'),
			formRecipientId = $('#' + depress.parents('.selected-item').data('inputid'));
		
		//text and value notation
		selectedValueViewer.text(depress.text());
		formRecipientId.attr('value', depress.data('value'));
	}

	// Filter Submit button
	$('.extended-filter input.submit-button').on('click', function(event) {
		var extFilter = $(this).parents('.extended-filter'),
			e = extFilter;

		resetSelectedItemHandler();
		baseFilterHandler(extFilter);
	});



	//Add to favorites
	$('.favorites-button a').hover(
		function(event) { $(this).parent().addClass('hover'); },
		function(event) { $(this).parent().removeClass('hover'); }
	).on('click', function (event) {
		$(this).parent().toggleClass('on');

		ajaxRequestToFavorites();
	});

	function ajaxRequestToFavorites (el) {
		$.ajax({
			url: '/any-url',
			type: 'POST',
			data: 'type=anytype',
			success: function (xhr) {
				console.log('Request successfully sent.');
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log('Error sending request!');
			}
		});
	}

	//Choose a size of goods
	$('.choose-goods-size .choice-item.selectable').hover(
		function(event) { $(this).addClass('hover'); },
		function(event) { $(this).removeClass('hover'); }
	).on('click', function (event) {
		var el = $(this);

		el.siblings('.selectable').removeClass('on')
		el.addClass('on');

		saveGoodsSize(el);
	});

	function saveGoodsSize (el) {
		var goodsSize = el.text(),
			goodsid = el.parent().data('goodsid'),
			formRecipientId = $('#' + goodsid);

		formRecipientId.attr('value', goodsSize);
	}



	//Custom Radio Buttons
	$('.radio-wrapper .choice-item.selectable').on('click', function (event) {
		var el = $(this);

		el.siblings('.selectable').removeClass('on')
		el.addClass('on');

		saveRadioData(el);
	});

	function saveRadioData (el) {
		var dataValue = el.data('value'),
			dataId = el.parent().data('id'),
			formRecipientId = $('#' + dataId);

		formRecipientId.attr('value', dataValue);
	}



	//Add to Cart
	$('.add-to-cart.submit').on('click', function(event) {
		event.preventDefault();

		ajaxRequestToCart();
	});

	function ajaxRequestToCart (el) {
		$.ajax({
			url: '/any-url',
			type: 'POST',
			data: 'type=anytype',
			success: function (xhr) {
				console.log('Request successfully sent.');
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log('Error sending request!');
			}
		});
	}



	//Delete Goods from Basket
	$('.close-button.delete-basket-item').on('click', function (event) {
		var el = $(this).parents('tr'),
			self = $(this);

		el.fadeOut(400, function () {
			//console.log('3) ', $(this));
			//console.log('4) ', self);

			if (self.parents('tr').siblings('tr').length === 1) {
				self.parents('tr').parent().append("<tr class=\"info\"><td colspan=\"6\">Корзина пустая</td></tr>");
			}

			$(this).remove();

			culcTotalCost();
		});

	});



	//Add comment
	$('.last-reviews .leave-comment').on('click', function (argument) {
		var self = $(this).parents('.last-reviews');

		$(this).parents('.last-reviews').find('.output-container').fadeOut(150,function(){
			self.find('.input-container').fadeIn(150,function(){
				$(this).show();
			});
		});
	});

	$('.last-reviews .navigation-link.prev').on('click', function (argument) {
		var self = $(this).parents('.last-reviews');

		$(this).parents('.last-reviews').find('.input-container').fadeOut(150,function(){
			self.find('.output-container').fadeIn(150,function(){
				$(this).show();
			});
		});
	});


	//initializing
	$('.content-items-slider .controls .prev').addClass('disabled');

	function reInitArrows(slider){
		var elementsCount = $(slider).find('.item-preview').length,
			elementWidth = $(slider).find('.item-preview:first').outerWidth(true),
			controls = $(slider).parent().siblings('.controls');

		if (parseInt($(slider).css('marginLeft')) ===  0 ) {
				controls.find('.prev').addClass('disabled')
						.siblings('.marker').removeClass('disabled');

		} else if (parseInt($(slider).css('marginLeft')) ===  (-(elementsCount-5) * elementWidth)) {			
				controls.find('.next').addClass('disabled')
				          .siblings('.marker').removeClass('disabled');
		}
		else {
			controls.find('.marker').removeClass('disabled');
		}	
	}



	// Content Slider
	var sliderArrows = $('.content-items-slider > .controls > .marker'),
		animating = false;

	sliderArrows.on('click',function(event){

		if ( animating || $($(this)).hasClass('disabled') ) return;
		animating = true;


		var slider = $(this).parents().siblings('.content-items-wrapper').find('.items-inner-wrapper'),
			self = this;


		if ($(this).hasClass('next')) {

			slider.animate({ 'marginLeft':'-=212px' }, 300, function(){ 

				animating = false; 					
				
				reInitArrows(slider);
			});
	    }
	    if ($(this).hasClass('prev')) {
		
			slider.animate({ 'marginLeft':'+=212px' }, 300, function(){ 
				animating = false; 

				reInitArrows(slider);
			});

		}

    });	



	// Base Slider
	var baseSliderClass = '.slider-container',
		baseSlider = $(baseSliderClass),
		slideCount = baseSlider.find($('.slider-item')).length,
		switcherListen = baseSlider.find('.slider-switcher'),
		switcherObject = '<div class="switcher-item"></div>';

	while (slideCount--) {
		$(switcherObject).appendTo(switcherListen);
	}

	var baseSliderSwitcherItem = baseSlider.find('.switcher-item');

	baseSlider.find('.switcher-item:first').addClass('on');

	baseSliderSwitcherItem.on('click', function() {
		if ($(this).hasClass('on')) {
			return;
		}

		var currentIndex = $(this).index();

		baseSliderSwitcherItem.removeClass('on').eq(currentIndex).addClass('on');

		$(this).parents(baseSliderClass).find('.slider-item.active').fadeOut(300,function(){
			$(this).removeClass('active');
			
			$(this).parents(baseSliderClass).find('.slider-item').eq(currentIndex).fadeIn(300,function(){
				$(this).addClass('active');
			});
		});
	});



	// Viewer
	var productViewer,
		factor,
		brandViewerClass = '.viewer-container',
		brandViewer = $(brandViewerClass),
		brandViewerSwitcherItem = brandViewer.find('.switcher-item');


	brandViewer.find('.switcher-item:first').addClass('on').end()
		.find('.viewer-item:first').show().addClass('active').end()
		.find('.magnifier-item:first').addClass('show');

	brandViewerSwitcherItem.on('click', function() {
		if ($(this).hasClass('on')) {
			return;
		}

		if (brandViewerSwitcherItem.parents(brandViewerClass).hasClass('product-viewer')) {
			productViewer = true;
		} else {
			productViewer = false;
		}

		var currentIndex = $(this).index();

		brandViewerSwitcherItem.removeClass('on').eq(currentIndex).addClass('on');

		$(this).parents(brandViewerClass).find('.viewer-item.active').fadeOut(300,function(){
			$(this).removeClass('active');
			
			$(this).parents(brandViewerClass).find('.viewer-item').eq(currentIndex).fadeIn(300,function(){
				$(this).addClass('active');
			});
		});

		if (productViewer) {
			brandViewer.find('.magnifier').hide()
				.find('.magnifier-item').removeClass('show')
				.eq(currentIndex).addClass('show');
		}

		brandViewer.find('.viewer-item.increased').removeClass('increased');
	});

	brandViewer.find('.viewer-item').on('click', function (event) {
		if ($(this).hasClass('active')) {
			if ($(this).hasClass('increased')) {

				$(this).removeClass('increased');
				brandViewer.find('.magnifier').hide();
				return;

			} else {

				$(this).addClass('increased');
				brandViewer.find('.magnifier').show(imgHeight);
				
				var magnifierHeight = parseInt($(this).parents(brandViewerClass).find('.magnifier').height()),
					imgHeight = parseInt($(this).parents(brandViewerClass).find('.magnifier-item.show').height());
					factor = ( imgHeight / magnifierHeight ) - 1;
			}
		} else {
			return;
		}
	});
	
	$(brandViewerClass).find('.magnifier').mousemove(function(e) {
		var wrapperOffset = -1 * (e.pageY - $(this).offset().top) * factor;

  		$(this).find('.inner-wrapper').css("marginTop", wrapperOffset + "px"); 
 	});
});

