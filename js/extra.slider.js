/****************
 *
 *
 *
 * EXTRA SLIDER 1.0
 *
 *
 *
 * Minimum html needed

 <div id="slider-id">
 <div class="slider">
 <div class="wrapper">
 <ul>
 <li>some html</li>
 <li>some html</li>
 <li>some html</li>
 <li>some html</li>
 <li>...</li>
 </ul>
 </div>
 <div class="navigation">
 <a href="#" class="prev">Précédent</a>
 <a href="#" class="next">Suivant</a>
 </div>
 <div class="pagination"></div>
 </div>
 </div>

 */
(function($) {
 
	if(typeof $window == 'undefined') {
		$window = $(window);
	}

	$.fn.extraSlider = function (options) {

		function repeat(str, n) {
			return new Array(n + 1).join(str);
		}

		var opt = $.extend({
			'auto': 0,
			'draggable': false,
			'keyboard': false,
			'margin': 0,
			'navigate': true,
			'paginate': true,
			'paginateContent': '',
			'resizable': true,
			'speed': 0.5,
			'type': 'slide',
			'onInit': null,
			'onMoveStart': null,
			'onMoveEnd': null
		}, options);

		this.each(function () {

			/*********************************** SETUP VARS ***********************************/
			var $this = $(this),
				$wrapper = $('> .wrapper', this),
				$slider = $wrapper.find('> ul'),
				$items = $slider.find('> li'),
				numClones,
				$navigation = $this.find('.navigation'),
				$pagination = $this.find('.pagination'),
				singleWidth = getDimension('width'),
				singleHeight = getDimension('height'),
				total = $items.length,
				visible = Math.ceil($wrapper.width() / singleWidth),
				currentItem = 1,
				previousItem = total,
				pages = Math.ceil($items.length / visible),
				slideTween;

			/*********************************** INITIALIZE ***********************************/
			switch (opt.type) {
				default:
				case "slide":
				
					// ADD A CLASS TO STYLE IT
					$this.addClass('extra-slider-slide');

					// CLONE BEFORE
					$items.first().before($items.slice(-(visible + opt.margin)).clone().addClass('cloned'));

					// CLONE AFTER
					$items.last().after($items.slice(0, visible + opt.margin).clone().addClass('cloned'));

					// GET ALL ITEMS (clones included)
					$items = $slider.find('> li');
					
					// COUNT CLONES
					numClones = $items.filter('.cloned').size() / 2;

					break;


				case "fade":
				
					// ADD A CLASS TO STYLE IT
					$this.addClass('extra-slider-fade');
					
					// INITIALIZE ALPHA AND ZINDEX
					$items.each(function (i) {
						if (i == 0) {
							TweenMax.set($(this), {css: {autoAlpha: 1, zIndex: 2}});
						} else {
							TweenMax.set($(this), {css: {autoAlpha: 0, zIndex: 1}});
						}
					});
					break;
			}

			/*********************************** GO TO PAGE ***********************************/
			function gotoPage(_page, time) {

				time = typeof time !== 'undefined' ? time : opt.speed;

				var dir = _page < currentItem ? -1 : 1;

				if (!TweenMax.isTweening($slider) && !TweenMax.isTweening($items)) {

					previousItem = currentItem; 
					currentItem = parseInt(_page);
					
					if(opt.type == 'fade') {
						if(currentItem == total && dir == 1) {
							currentItem = 0;
						} else if (currentItem == 0  && dir == -1) {
							currentItem = total;
						}
					}

					if (opt.onMoveStart && time > 0) {
						opt.onMoveStart(currentItem, pages);
					}

					if (opt.paginate) {
						$pagination.find("a").removeClass("active").eq(currentItem - 1).addClass("active");
					}

					switch (opt.type) {
						default:
						case "slide":
							var left = -(singleWidth * (currentItem + numClones));
							slideTween = TweenMax.to($slider, time, {css: {left: left}, onComplete: endHandler, onCompleteParams:[time]});
							break;
						case "fade":
							TweenMax.to($items.eq(previousItem - 1).css("zIndex", 1), time, {css: {autoAlpha: 0}});
							TweenMax.to($items.eq(currentItem - 1).css("zIndex", 2), time, {css: {autoAlpha: 1}, onComplete: endHandler, onCompleteParams:[time]});
							break;
					}
				}
			}
			/*********************************** HELPER FUNCTIONS ***********************************/
			function gotoNext(time) {
				time = typeof time !== 'undefined' ? time : opt.speed;
				gotoPage(currentItem + 1, time);
			}
			function gotoPrev(time) {
				time = typeof time !== 'undefined' ? time : opt.speed;
				gotoPage(currentItem - 1, time);
			}

			/*********************************** UPDATE ***********************************/
			function update() {
				// RESET DIMENSIONS
				$slider.css('width', '');
				$items.css('width', '').css('height', '');
				$wrapper.css('width', '').css('height', '');

				// GET DIMENSIONS
				singleWidth = getDimension('width');
				singleHeight = getDimension('height');

				if (opt.type == 'slide') {
					// SET DIMENSIONS
					$slider.width(99999);
					slideTween = TweenMax.set($slider, {css: {left: -(singleWidth * (currentItem + numClones))}});
				}
				// SET DIMENSIONS
				$items.css({
					'width': singleWidth + 'px',
					'height': singleHeight + 'px'
				});
				$wrapper.css({
					'width': (singleWidth * visible) + 'px',
					'height': singleHeight + 'px'
				});
			}

			/*********************************** FUNCTIONS ***********************************/
			// when the first animation is finished
			function endHandler(time) {
				if (opt.type === "slide") {
					adjustPosition();
					if(opt.draggable && opt.type == 'slide') {
						$wrapper.swipe("enable");
					}
				}
				if (opt.onMoveEnd && time > 0) {
					opt.onMoveEnd(currentItem, total);
				}
			}
			// adjust the slider position
			function adjustPosition() {
				// too far on the left (previous)
				if (currentItem >= total) {
					currentItem = 0;
					TweenMax.set($slider, {css: {left: -(singleWidth * (currentItem + numClones))}});
				}
				// too far on the right (next)
				else if (currentItem < 0) {
					currentItem = total - 1;
					TweenMax.set($slider, {css: {left: -(singleWidth * (currentItem + numClones))}});
				}
			}
			// get the blocs dimensions
			function getDimension(type) {
				var max = 0;
				$items.each(function () {
					var item = $(this);
					var current = type == 'height' ? item.outerHeight(true) : item.outerWidth(true);
					if (current > max) {
						max = current;
					}
				});
				return max;
			}

			/*********************************** LISTENERS ***********************************/
			$(this).on('update', function () {
				update();
			});
			// Bind next
			$(this).on('next', function (event, time) {
				gotoNext(time);
			});
			// Bind prev
			$(this).on('prev', function (event, time) {
				gotoPrev(time);
			});
			// Bind goto page
			$(this).on('goto', function (event, page, time) {
				time = typeof time !== 'undefined' ? time : opt.speed;
				gotoPage(page, time);
			});
			if(opt.resizable) {
				$window.on('resize', function() {
					update();
				});
			}

			/*********************************** NAVIGATION ***********************************/
			if (opt.navigate && $navigation.length) {
				$('a.prev', $navigation).click(function () {
					gotoPrev();
					return false;
				});
				$('a.next', $navigation).click(function () {
					gotoNext();
					return false;
				});
			}

			/*********************************** PAGINATION ***********************************/
			if (opt.paginate && $pagination.length) {
				for (var i = 0; i < total; i++) {
					$("<a>", {'href': '#'}).html(opt.paginateContent != '' ? opt.paginateContent : i + 1).appendTo($pagination);
				}
				$pagination.find("a").removeClass("active").eq(currentItem - 1).addClass("active");
				$('a', $pagination).each(function (i) {
					$(this).click(function () {
						if (i + 1 != currentItem){
							gotoPage(i + 1);
						}
						return false;
					});
				});
			}

			/*********************************** KEYBOARD ***********************************/
			if (opt.keyboard) {
				$window.on('keydown', function(event) {
					if(event.which == 39) {
						gotoNext();
					}
					if(event.which == 37) {
						gotoPrev();
					}
				});
			}

			/*********************************** AUTO ***********************************/
			var autoTween;
			if (!isNaN(opt.auto) && opt.auto > 0) {
				function autoSlide() {
					autoTween = TweenMax.delayedCall(opt.auto, function() {
						gotoNext();
						autoSlide();
					});
				}
				autoSlide();
				$this.on('mouseenter', function() {
					autoTween.pause();	
				}).on('mouseleave', function() {
					autoTween.resume();	
				});
			}

			/*********************************** DRAGGABLE ***********************************/
			if (opt.draggable && opt.type == 'slide') {
				var reference = 0,
					margin = 0;

				$wrapper.swipe({
					allowPageScroll: "vertical",
					threshold: 50,
					excludedElements: '.noSwipe',
					triggerOnTouchEnd: true,
					triggerOnTouchLeave: true,
					tap: function (event, target) {},
					swipeStatus: function (event, phase, direction, distance, duration) {

						if(slideTween.isActive()) {
							$wrapper.swipe("disable");
							return;
						}
						
						if (phase == 'start') {
							$this.addClass('mouseDown');
							reference = parseFloat($slider.css('left'));
							margin = 0;
						}

						if (phase == 'move' && (direction == 'left' || direction == 'right')) {
							var dir = (direction === 'left') ? -1 : 1,
								left = reference + (dir * distance) + margin;
							TweenMax.set($slider, {css: {'left': left}});
						}

						if ((phase == 'end' || phase == 'cancel') && (direction == 'left' || direction == 'right')) {
							$this.removeClass('mouseDown');
							
							if(direction == 'right') {
								gotoPrev();
							} else if(direction == 'left') {
								gotoNext();
							}
						}
					}
				});
			}

			/*********************************** ON INIT ***********************************/
			if (opt.onInit) {
				opt.onInit(total, $(this));
			}

			/*********************************** FIRST UPDATE ***********************************/
			update();
			$window.load(function() {
				if(opt.resizable) {
					update();
				}
			});

		});

		return this;

	};
})(jQuery);