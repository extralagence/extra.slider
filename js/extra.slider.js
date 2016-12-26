/****************
 *
 *
 *
 * EXTRA SLIDER 1.6
 * http://slider.extralagence.com
 *
 *
 *
 */
(function ($) {
	'use strict';
	/*global console, jQuery, $, window, TweenMax, Draggable, Quad */
	var $window = $(window);

	$.fn.extraSlider = function (options) {

		var opt = $.extend({
			'auto'            : false,
			'autoPauseEvents' : 'mouseenter',
			'autoResumeEvents': 'mouseleave',
			'direction'       : 'x',
			'draggable'       : false,
			'draggableOptions': {},
			'ease'            : Quad.easeOut,
			'keyboard'        : false,
			'itemSelector'    : '>*',
			'margin'          : 1,
			'minDrag'         : 0,
			'navigation'      : null,
			'pagination'      : null,
			'paginateContent' : '',
			'speed'           : 0.5,
			'startAt'         : 0,
			'type'            : 'slide',
			'waitBeforeMove'  : false,
			'onGotoNext'      : null,
			'onGotoPrev'      : null,
			'onInit'          : null,
			'onMoveEnd'       : null,
			'onMoveStart'     : null,
			'onPause'         : null,
			'onResume'        : null,
			'onUpdate'        : null,
			'onUpdateClones'  : null,
			'onDragStart'     : null,
			'onDragEnd'       : null
		}, options);

		this.each(function () {

			/*********************************** SETUP VARS ***********************************/
			var $this = $(this),
				$items = $this.find(opt.itemSelector).addClass("extra-slider-item"),
				numClones = 0,
				singleDimension = 0,
				total = $items.length - 1,
				currentItem = opt.startAt,
				previousItem = total,
				// PAGINATION
				paginate = opt.pagination && opt.pagination.length > 0,
				// NAVIGATION
				navigate = opt.navigation && opt.navigation.length > 0,
				i = 0,
				// AUTOMATIC
				autoTween,
				pauseEvents = "pause",
				resumeEvents = "resume",
				isPaused = false,
				// DRAG
				drag;

			// Adjust margin in case there is draggable involved
			if (opt.draggable) {
				opt.margin += 1;
			}

			// add auto pause events
			if (opt.autoPauseEvents && opt.autoPauseEvents != '') {
				pauseEvents += (" " + opt.autoPauseEvents);
			}

			// add auto resume events
			if (opt.autoResumeEvents && opt.autoResumeEvents != '') {
				resumeEvents += (" " + opt.autoResumeEvents);
			}

			/*********************************** INITIALIZE ***********************************/
			function initialize() {

				var tweenItemProperties = {},
					tweenSliderProperties = {};

				// set index
				$items.each(function (index) {
					$(this).data('index', index);
					$(this).data('index-absolute', index);
				});

				$this.addClass('extra-slider-' + opt.type);

				// is slide
				if (opt.type === "slide") {
					$this.addClass('extra-slider-direction-' + opt.direction);
					updateClones();
					tweenSliderProperties[opt.direction + 'Percent'] = (currentItem - numClones) * 100;
					TweenMax.set($this, tweenSliderProperties);
				}
				// is fade
				else if (opt.type === "fade") {
					$items.each(function (index) {
						if (index === currentItem) {
							TweenMax.set($(this), {
								autoAlpha: 1,
								xPercent : -(index * 100),
								zIndex   : total + 1
							});
						} else {
							TweenMax.set($(this), {
								autoAlpha: 0,
								xPercent : -(index * 100),
								zIndex   : total - index + 1
							});
						}
					});
				}
				// is curtain
				else if (opt.type === "curtain") {
					$items.each(function (index) {
						if (index === currentItem) {
							TweenMax.set($(this), {
								xPercent: -(index * 100),
								zIndex  : total + 1
							});
						} else {
							TweenMax.set($(this), {
								xPercent: -(index * 100),
								zIndex  : total - index + 1
							});
						}
					});
				}
				// is custom
				else if (opt.type === "custom") {
					// Nothing here
				}

				$items.not(".extra-slider-clone").first().addClass("extra-slider-first");
			}

			/*********************************** UPDATE ***********************************/
			function update() {

				// POSITION AND WIDTH
				if (opt.type === 'slide') {
					adjustPosition();
				}

				// ACTIVE CLASS
				$items.removeClass('extra-slider-active');
				$items.eq(currentItem + numClones).addClass('extra-slider-active');

				// TRIGGER ON UPDATE
				if (opt.onUpdate) {
					opt.onUpdate($items.eq(currentItem + numClones), currentItem);
				}
				$this.trigger('extra:slider:updated', [$items.eq(currentItem + numClones), currentItem]);

				if (drag) {
					drag.update();
				}

			}

			/*********************************** FUNCTIONS ***********************************/
			// adjust the slider position
			function adjustPosition() {

				if (opt.type === 'slide' && $this[0]._gsTransform === undefined) {
					return;
				}

				var needAdjustement = false,
					currentItemReference = currentItem,
					currentPosition = 0,
					adjustedPosition = 0,
					targetPosition = 0,
					delta = 0,
					position = 0,
					tweenProperties = {};

				if (currentItem > total) {
					needAdjustement = true;
					// too far on the left (previous)
					currentItem = currentItem % (total + 1);
				} else if (currentItem < 0) {
					needAdjustement = true;
					// too far on the right (next)
					currentItem = currentItem + (total + 1);
				}

				if (needAdjustement && opt.type === 'slide') {
					currentPosition = $this[0]._gsTransform[opt.direction + 'Percent'];
					targetPosition = -(currentItemReference + numClones);
					targetPosition *= 100;
					delta = targetPosition - currentPosition;
					position = -(((currentItem + numClones) * 100) + delta);
					tweenProperties[opt.direction + 'Percent'] = position;
					TweenMax.set($this, tweenProperties);
				}
			}

			// when the first animation is finished
			function endHandler(time, previousItem) {

				// endHandler for slide
				if (opt.type === "slide") {
					adjustPosition();
				}

				// set active
				$items.eq(currentItem + numClones).addClass('extra-slider-active');

				if (!isNaN(opt.auto) && opt.auto > 0) {
					autoSlide();
				}

				// listener
				if (opt.onMoveEnd && time > 0) {
					opt.onMoveEnd($items.eq(currentItem + numClones), currentItem);
				}
				$this.trigger('extra:slider:moveEnd', [$items.eq(currentItem + numClones), currentItem]);
			}

			/*********************************** GO TO PAGE ***********************************/
			function gotoPage(newPage, time) {

				time = (time !== undefined) ? time : opt.speed;

				if (opt.waitBeforeMove === true && TweenMax.isTweening($this)) {
					return;
				}

				var position,
					tweenProperties = {
						onComplete      : endHandler,
						onCompleteParams: [time],
						ease            : opt.ease
					},
					tweenPropertiesTarget = null;

				$items.removeClass('extra-slider-active');

				previousItem = currentItem;
				currentItem = newPage;

				adjustPosition();

				if (opt.onMoveStart && time > 0) {
					opt.onMoveStart($items.eq(currentItem + numClones), currentItem, previousItem, newPage);
				}
				$this.trigger('extra:slider:moveStart', [$items.eq(currentItem + numClones), currentItem, previousItem, newPage]);

				if (paginate) {
					opt.pagination.each(function () {
						$(this).find("a").removeClass("extra-slider-link-active").eq(currentItem).addClass("extra-slider-link-active");
					});
				}


				// is slide
				if (opt.type === "slide") {
					position = -(currentItem + numClones);
					position = position * 100;
					tweenProperties[opt.direction + 'Percent'] = position;
					TweenMax.to($this, time, tweenProperties);
				}

				// is fade
				else if (opt.type === "fade") {
					$items.each(function (index, element) {
						if (index === currentItem) {
							$items.eq(index).css("zIndex", 3);
						} else if (index === previousItem) {
							$items.eq(index).css("zIndex", 2);
						} else {
							$items.eq(index).css("zIndex", 1);
						}
					});
					tweenProperties.autoAlpha = 1;
					TweenMax.fromTo($items.eq(currentItem), time, {
							autoAlpha: 0
						},
						tweenProperties);
				}

				// is curtain
				else if (opt.type === "curtain") {
					tweenPropertiesTarget = {};
					$items.each(function (index, element) {
						if (index === currentItem) {
							$items.eq(index).css("zIndex", 3);
						} else if (index === previousItem) {
							$items.eq(index).css("zIndex", 2);
						} else {
							$items.eq(index).css("zIndex", 1);
						}
					});
					if (newPage >= previousItem) {
						tweenProperties.width = '0%';
						tweenProperties.left = '100%';
						tweenPropertiesTarget.width = '100%';
						tweenPropertiesTarget.left = '0%';
					} else {
						tweenProperties.width = '0%';
						tweenProperties.left = '0%';
						tweenPropertiesTarget.width = '100%';
						tweenPropertiesTarget.left = '0%';
					}
					TweenMax.fromTo($items.eq(currentItem), time, tweenProperties, tweenPropertiesTarget);
				}

				// is curtain
				else if (opt.type === "custom") {
					$items.each(function (index, element) {
						/*if (index === currentItem) {
						 $items.eq(index).css("zIndex", 3);
						 } else if (index === previousItem) {
						 $items.eq(index).css("zIndex", 2);
						 } else {
						 $items.eq(index).css("zIndex", 1);
						 }*/
					});
					TweenMax.to($this, time, tweenProperties);
				}
			}

			function updateClones() {

				// REMOVE ALL CLONES
				$items.find('.extra-slider-clone').remove();

				// CLONE BEFORE
				$items.first().before($items.slice(-opt.margin).clone(true).addClass('extra-slider-clone'));

				// CLONE AFTER
				$items.last().after($items.slice(0, opt.margin).clone(true).addClass('extra-slider-clone'));

				// GET ALL ITEMS (clones included)
				$items = $this.find(opt.itemSelector);

				// COUNT CLONES
				var $clones = $items.filter('.extra-slider-clone');
				numClones = Math.max(0, $clones.length / 2);

				// REFRESH ABSOLUTE INDEX ON EACH CLONES
				$clones.each(function () {
					var $clone = $(this),
						index = $clone.data('index');

					if ($clone.index() < opt.margin) {
						index = index - (total + 1);
					} else {
						index = index + (total + 1);
					}

					$clone.data('index-absolute', index);
				});

				// TRIGGER ON UPDATE
				if (opt.onUpdateClones) {
					opt.onUpdateClones($items.eq(currentItem + numClones), currentItem);
				}
				$this.trigger('extra:slider:updateClones', [$items.eq(currentItem + numClones), currentItem]);
			}

			/*********************************** HELPER FUNCTIONS ***********************************/
			function gotoNext(time) {
				if (opt.onGotoNext) {
					opt.onGotoNext($items.eq(currentItem + numClones), currentItem);
				}
				$this.trigger('extra:slider:onGotoNext', [$items.eq(currentItem + numClones), currentItem]);
				time = (time !== undefined) ? time : opt.speed;
				gotoPage(currentItem + 1, time);
			}

			function gotoPrev(time) {
				if (opt.onGotoPrev) {
					opt.onGotoPrev($items.eq(currentItem + numClones), currentItem);
				}
				$this.trigger('extra:slider:onGotoPrev', [$items.eq(currentItem + numClones), currentItem]);
				time = time !== undefined ? time : opt.speed;
				gotoPage(currentItem - 1, time);
			}

			// auto slide
			function autoSlide() {
				if (autoTween) {
					autoTween.kill();
				}
				autoTween = TweenMax.delayedCall(opt.auto, function () {
					gotoNext();
					autoSlide();
				});
			}


			/*********************************** LISTENERS ***********************************/
			$(this).on('extra:slider:update', function () {
				update();
			});
			// Bind next
			$(this).on('extra:slider:next', function (event, time) {
				gotoNext(time);
			});
			// Bind prev
			$(this).on('extra:slider:prev', function (event, time) {
				gotoPrev(time);
			});
			// Bind goto page
			$(this).on('extra:slider:goto', function (event, page, time) {
				time = time !== undefined ? time : opt.speed;
				gotoPage(page, time);
			});
			// Bind pause
			$(this).on('extra:slider:pause', function (event, page, time) {
				autoTween.pause();
			});
			// Bind resume
			$(this).on('extra:slider:resume', function (event, page, time) {
				autoTween.resume();
			});

			/*********************************** NAVIGATION ***********************************/
			if (navigate) {

				opt.navigation.each(function (index, element) {
					var $_navigation = $(this);
					if ($_navigation.find('a').length < 2) {
						$("<a>", {'href': '#', 'class': 'next'}).appendTo($_navigation);
						$("<a>", {'href': '#', 'class': 'prev'}).appendTo($_navigation);
					}

					$('a.prev', $_navigation).on('click', function (event) {
						event.preventDefault();
						gotoPrev();
					});
					$('a.next', $_navigation).on('click', function (event) {
						event.preventDefault();
						gotoNext();
					});
				});
			}

			/*********************************** PAGINATION ***********************************/
			if (paginate) {
				opt.pagination.each(function () {

					// Current pagination
					var $_pagination = $(this);

					// Populate pagination with links
					for (i = 0; i <= total; i += 1) {
						$("<a>", {'href': '#'}).html(opt.paginateContent !== '' ? opt.paginateContent.replace("%d", (i + 1)) : i + 1).appendTo($_pagination);
					}

					// Set up links
					$_pagination.find("a").removeClass('extra-slider-link-active').eq(currentItem).addClass('extra-slider-link-active');

					// On click on links
					$('a', $_pagination).each(function (index, item) {
						var $link = $(item);
						$link.click(function (event) {
							event.preventDefault();
							gotoPage(index);
						});
					});
				});
			}

			/*********************************** KEYBOARD ***********************************/
			if (opt.keyboard) {
				$window.on('keydown', function (event) {
					if (event.which === 40 || event.which === 39) {
						event.preventDefault();
						gotoNext();
					}
					if (event.which === 38 || event.which === 37) {
						event.preventDefault();
						gotoPrev();
					}
				});
			}

			/*********************************** AUTO ***********************************/
			if (!isNaN(opt.auto) && opt.auto > 0) {
				autoSlide();
				$this
				// PAUSE
					.on(pauseEvents, function (event) {
						if (isPaused) {
							return;
						}
						event.stopImmediatePropagation();
						isPaused = true;
						// listener
						if (opt.onPause) {
							opt.onPause($items.eq(currentItem + numClones), currentItem);
						}
						$this.trigger('extra:slider:paused', [$items.eq(currentItem + numClones), currentItem]);
						autoTween.pause();
					})

					// RESUME
					.on(resumeEvents, function (event) {
						if (!isPaused) {
							return;
						}
						isPaused = false;
						// listener
						if (opt.onResume) {
							opt.onResume($items.eq(currentItem + numClones), currentItem);
						}
						$this.trigger('extra:slider:resumed', [$items.eq(currentItem + numClones), currentItem]);
						autoTween.resume();
					});
			}

			/*********************************** DRAGGABLE ***********************************/
			if (opt.draggable && opt.type === 'slide') {

				$this.addClass('extra-slider-draggable');

				if (Draggable !== undefined) {
					var draggableOpt = $.extend({
						type       : opt.direction,
						cursor     : 'move',
						lockAxis   : false,
						throwProps : false,
						zIndexBoost: false,

						onDragStart: function () {
							// Get the width to be able to convert pixel to percents
							singleDimension = opt.direction === 'x' ? $items.first().width() : $items.first().height();

							// Events
							if (opt.onDragStart) {
								opt.onDragStart($items.eq(currentItem + numClones), currentItem);
							}
							$this.trigger('extra:slider:onDragStart', [$items.eq(currentItem + numClones), currentItem]);
						},

						onDragEnd: function () {

							// Position, from pixels to percent
							var realPosition = (drag[opt.direction] / singleDimension * 100) - ((currentItem - numClones) * 100),
								draggedPage = -(realPosition / 100 - numClones),
								targetPage,
								tweenProperties = {},
								position;

							// Check minimum drag amount to change slide
							if (opt.minDrag > 0 && Math.abs(drag[opt.direction]) <= opt.minDrag) {
								targetPage = currentItem;
							}

							// Make sure it doesn't come back in place
							else if (draggedPage > currentItem) {
								targetPage = Math.ceil(draggedPage);
							} else {
								targetPage = Math.floor(draggedPage);
							}

							// Get position in percent
							position = -(draggedPage + numClones);
							position = position * 100;

							// Set pixel position to 0
							tweenProperties[opt.direction] = 0;

							// Set percent position according to position
							tweenProperties[opt.direction + 'Percent'] = position;

							// Set properties
							TweenMax.set($this, tweenProperties);

							// Go to correct page
							gotoPage(targetPage);

							// Events
							if (opt.onDragEnd) {
								opt.onDragEnd($items.eq(currentItem + numClones), currentItem);
							}
							$this.trigger('extra:slider:onDragEnd', [$items.eq(currentItem + numClones), currentItem]);
						}
					}, opt.draggableOptions);

					Draggable.create($this, draggableOpt);
					drag = Draggable.get($this);
				} else {
					console.log('Draggable is not detected. You need to load it to enable drag. More info here : http://www.greensock.com/draggable/');
				}
			}

			/*********************************** INIT ***********************************/
			initialize();
			update();

			// Events
			if (opt.onInit) {
				opt.onInit($items.eq(currentItem + numClones), currentItem);
			}
			$this.addClass('extra-slider-processed').trigger('extra:slider:init', [$items.eq(currentItem + numClones), currentItem]);
			gotoPage(currentItem, 0);
		});

		return this;

	};
}(jQuery));