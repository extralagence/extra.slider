/****************
 *
 *
 *
 * EXTRA SLIDER 1.2
 * http://slider.extralagence.com
 *
 *
 *
 */
(function ($) {
	'use strict';
	/*global console, jQuery, $, window, TweenMax, Draggable, Quad */
	var $window = window.$window || $(window),
		extra = window.extra || {};

	$.fn.extraSlider = function (options) {

		var opt = $.extend({
			'auto'            : false,
			'draggable'       : false,
			'dragWindow'	  : false,
			'dragWindowObject': $window,
			'ease'            : Quad.easeOut,
			'forcedDimensions': true,
			'keyboard'        : false,
			'margin'          : 0,
			'minDrag'	      : 50,
			'navigate'        : true,
			'navigation'	  : null,
			'paginate'        : true,
			'pagination'	  : null,
			'paginateContent' : '',
			'resizable'       : true,
			'speed'           : 0.5,
			'type'            : 'slide',
			'onGotoNext'      : null,
			'onGotoPrev'      : null,
			'onInit'          : null,
			'onMoveEnd'       : null,
			'onMoveStart'     : null,
			'onPause'         : null,
			'onResume'        : null,
			'onUpdate'        : null,
			'onUpdateClones'  : null
		}, options);

		this.each(function () {

			/*********************************** SETUP VARS ***********************************/
			var $this = $(this),
				$wrapper = $('> .wrapper', this),
				$slider = $wrapper.find('> ul'),
				$items = $slider.find('> li'),
				numClones = 0,
				$navigation = opt.navigation || $this.find('.navigation'),
				$pagination = opt.pagination || $this.find('.pagination'),
				singleWidth = 0,
				singleHeight = 0,
				total = $items.length - 1,
				visible = -1,
				totalWidth = singleWidth,
				currentItem = 0,
				previousItem = total,
				offset = 0,
				i = 0,
			// RESIZE
				resizeEvent,
			// AUTOMATIC
				autoTween,
			// DRAG
				drag,
				referenceX = 0,
				referenceY = 0,
				referenceScroll = 0,
				direction;

			/*********************************** FUNCTIONS ***********************************/
			// adjust the slider position
			function adjustPosition() {
				if (currentItem > total) {
					// too far on the left (previous)
					currentItem = 0;
				} else if (currentItem < 0) {
					// too far on the right (next)
					currentItem = total;
				}
				var left = -(totalWidth * (currentItem) + (numClones * singleWidth));
				TweenMax.set($slider, {x: left, force3D: "auto"});
			}

			// get the blocs dimensions
			function getDimension(type) {
				var max = 0,
					item,
					current;
				$items.not('.cloned').each(function () {
					item = $(this);
					current = (type === 'height') ? item.outerHeight(true) : item.outerWidth(true);
					if (current > max) {
						max = current;
					}
				});
				return max;
			}

			// when the first animation is finished
			function endHandler(time, previousItem) {
				// endHandler for slide
				if (opt.type === "slide") {
					adjustPosition();
					if (opt.draggable && opt.type === 'slide' && drag !== undefined) {
						Draggable.get($slider).enable();
					}
				} else if (opt.type === "fade" && previousItem.length) {
					TweenMax.set(previousItem.hide(), {autoAlpha: 0});
				}

				// set active
				$items.eq(currentItem + numClones).addClass('active');

				if (!isNaN(opt.auto) && opt.auto > 0) {
					autoSlide();
				}

				// listener
				if (opt.onMoveEnd && time > 0) {
					opt.onMoveEnd($items.eq(currentItem + numClones), total + 1, $this);
				}
				$this.trigger('moveEnd.extra.slider', [$items.eq(currentItem + numClones), total + 1, $this]);
			}

			/*********************************** GO TO PAGE ***********************************/
			function gotoPage(newPage, time) {

				if (newPage === currentItem) {
					return;
				}

				time = (time !== undefined) ? time : opt.speed;

				var dir = newPage < currentItem ? -1 : 1,
					realCurrentItem,
					left;

				$items.removeClass('active');

				if (!TweenMax.isTweening($slider) && !TweenMax.isTweening($items)) {

					previousItem = currentItem;
					currentItem = parseInt(newPage, 10);

					if (opt.type === 'fade' || opt.type === 'custom') {
						if (currentItem > total) {
							currentItem = 0;
						} else if (currentItem < 0) {
							currentItem = total;
						}
					}

					realCurrentItem = currentItem;
					if (realCurrentItem > total) {
						// too far on the left (previous)
						realCurrentItem = 0;
					} else if (realCurrentItem < 0) {
						// too far on the right (next)
						realCurrentItem = total;
					}

					if (opt.onMoveStart && time > 0) {
						opt.onMoveStart($items.eq(realCurrentItem + numClones), total + 1, $this);
					}
					$this.trigger('moveStart.extra.slider', [$items.eq(realCurrentItem + numClones), total + 1, $this]);

					if (opt.paginate) {
						$pagination.each(function () {
							$(this).find("a").removeClass("active").eq(realCurrentItem).addClass("active");
						});
					}

					switch (opt.type) {
                    case "slide":
                        left = -(totalWidth * (currentItem) + (numClones * singleWidth));
                        if (offset !== 0) {
                            if (currentItem > total) {
                                left += singleWidth * offset;
                            }
                            if (currentItem < 0) {
                                left -= singleWidth * offset;
                            }
                        }
                        TweenMax.to($slider, time, {x: left, force3D: "auto", onComplete: endHandler, onCompleteParams: [time], ease: opt.ease});
                        break;
                    case "fade":
                        $items.eq(previousItem).css("zIndex", 1);
                        TweenMax.to($items.eq(currentItem).show().css("zIndex", 2), time, {css: {autoAlpha: 1}, onComplete: endHandler, onCompleteParams: [time, $items.eq(previousItem)]});
                        break;
					}
				}
			}

			/*********************************** UPDATE ***********************************/
			function update() {

				var newVisible;

				if (opt.forcedDimensions) {
					// RESET DIMENSIONS
					$slider.css('width', '');
					$items.css('width', '').css('height', '');
					$wrapper.css('width', '').css('height', '');
				}

				// GET DIMENSIONS
				singleWidth = getDimension('width');
				singleHeight = getDimension('height');

				// MULTIPLE AT A TIME
				totalWidth = singleWidth * visible;
				newVisible = Math.max(1, Math.floor($wrapper.width() / singleWidth));
				if (newVisible !== visible) {
					visible = newVisible;
					total = Math.floor(($items.not('.cloned').length - 1) / visible);
					offset = Math.abs((total + 1) * visible - ($items.not('.cloned').length));
					if (opt.type === 'slide') {
						updateClones();
					}
					update();
					return false;
				}


                // SET DIMENSIONS
				if (opt.forcedDimensions) {
					$items.css({
						'width' : singleWidth + 'px',
						'height': singleHeight + 'px'
					});
					$wrapper.css({
						'width' : totalWidth + 'px',
						'height': singleHeight + 'px'
					});
				}

				// POSITION AND WIDTH
				if (opt.type === 'slide') {
					adjustPosition();
					$slider.width(99999);
				}

				// ACTIVE CLASS
				$items.removeClass('active');
				$items.eq(currentItem + numClones).addClass('active');

				// TRIGGER ON UPDATE
				if (opt.onUpdate) {
					opt.onUpdate($items.eq(currentItem + numClones), total + 1, $this);
				}
				$this.trigger('update.extra.slider', [$items.eq(currentItem + numClones), total + 1, $this]);

			}

			function updateClones() {

				// REMOVE ALL CLONES
				$items.find('.cloned').remove();

				// CLONE BEFORE
				$items.first().before($items.slice(-(visible + opt.margin + offset)).clone(true).addClass('cloned'));

				// CLONE AFTER
				$items.last().after($items.slice(0, visible + opt.margin + offset).clone(true).addClass('cloned'));

				// GET ALL ITEMS (clones included)
				$items = $slider.find('> li');

				// COUNT CLONES
				numClones = $items.filter('.cloned').size() / 2 || 0;

				// TRIGGER ON UPDATE
				if (opt.onUpdateClones) {
					opt.onUpdateClones($items.eq(currentItem + numClones), total + 1, $this);
				}
				$this.trigger('updateClones.extra.slider', [$items.eq(currentItem + numClones), total + 1, $this]);
			}

			/*********************************** HELPER FUNCTIONS ***********************************/
			function gotoNext(time) {
				$this.trigger('gotoNext.extra.slider', [$this]);
				if (opt.onGotoNext) {
					opt.onGotoNext($this);
				}
				time = (time !== undefined) ? time : opt.speed;
				gotoPage(currentItem + 1, time);
			}

			function gotoPrev(time) {
				$this.trigger('gotoPrev.extra.slider', [$this]);
				if (opt.onGotoPrev) {
					opt.onGotoPrev($this);
				}
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

			/*********************************** SETUP VARS ***********************************/
			$items.each(function (index, elmt) {
				$(this).data('index', index);
			});
			singleWidth = getDimension('width');
			singleHeight = getDimension('height');

			/*********************************** INITIALIZE ***********************************/
			switch (opt.type) {
            case "slide":
                // ADD A CLASS TO STYLE IT
                $this.addClass('extra-slider-slide');
                break;

            case "fade":
                // ADD A CLASS TO STYLE IT
                $this.addClass('extra-slider-fade');

                // INITIALIZE ALPHA AND ZINDEX
                $items.each(function (i) {
                    if (i === currentItem) {
                        TweenMax.set($(this), {css: {autoAlpha: 1, zIndex: 2}});
                    } else {
                        TweenMax.set($(this), {css: {autoAlpha: 0, zIndex: 1}});
                    }
                });
                break;
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
				time = time !== undefined ? time : opt.speed;
				gotoPage(page, time);
			});
			// on resize
			if (opt.resizable) {
				resizeEvent = extra.resizeEvent !== undefined ? extra.resizeEvent : 'resize';
				$window.on(resizeEvent, function () {
					update();
				});
			}

			/*********************************** NAVIGATION ***********************************/
			if (opt.navigate) {
				if (!$navigation.length) {
					$navigation = $('<div class="navigation"><a href="#" class="prev">Previous</a><a href="#" class="next">Next</a></div>').insertAfter($wrapper);
				}
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
			if (opt.paginate) {
				if (!$pagination.length) {
					$pagination = $('<div class="pagination"></div>').insertAfter($wrapper);
				}
				if (opt.paginateContent !== '' && opt.paginateContent.length > 0) {
                    $pagination.empty();
                    for (i = 0; i <= total; i += 1) {
                        $("<a>", {'href': '#'}).html(opt.paginateContent !== '' ? opt.paginateContent.replace("%d", (i + 1)) : i + 1).appendTo($pagination);
                    }
                }

				$pagination.each(function () {
					$(this).find("a").removeClass('active').eq(currentItem).addClass('active');

					$('a', $(this)).each(function (i) {
						$(this).click(function () {
							if (!$(this).hasClass('active') && !$(this).hasClass('disabled')) {
								gotoPage(i);
							}
							return false;
						});
					});
				});
			}

			/*********************************** KEYBOARD ***********************************/
			if (opt.keyboard) {
				$window.on('keydown', function (event) {
					if (event.which === 39) {
						gotoNext();
					}
					if (event.which === 37) {
						gotoPrev();
					}
				});
			}

			/*********************************** AUTO ***********************************/
			if (!isNaN(opt.auto) && opt.auto > 0) {
				autoSlide();
				$this.on('mouseenter pause', function () {
					// listener
					if (opt.onPause) {
						opt.onPause($this);
					}
					$this.trigger('pause.extra.slider', [$this]);
					autoTween.pause();
				}).on('mouseleave resume', function () {
					// listener
					if (opt.onResume) {
						opt.onResume($this);
					}
					$this.trigger('resume.extra.slider', [$this]);
					autoTween.resume();
				});
			}

			/*********************************** DRAGGABLE ***********************************/
			if (opt.draggable && opt.type === 'slide') {

				$this.addClass('extra-slider-draggable');

				if (Draggable !== undefined) {
					Draggable.create($slider, {
						force3D : "auto",
						dragClickables : true,
						type : 'x',
						cursor : 'move',
						lockAxis : 'x,y',
						throwProps : false,
						onDrag: function (event) {
							if (this.y !== 0 && Math.abs(referenceX - this.x) < opt.minDrag && opt.dragWindow) {
								// user is moving vertically : scroll
								TweenMax.set(opt.dragWindowObject, {scrollTo: {autoKill: false, y: referenceScroll + (referenceY - this.pointerY)}});
								return false;
							}
						},
						onDragStart : function () {
							$this.trigger('pause').addClass('extra-slider-mouse-down');
							referenceX = this.x;
							referenceY = this.pointerY;
							referenceScroll = opt.dragWindowObject.scrollTop();
						},
						onDragEnd : function () {
							$this.trigger('resume').removeClass('extra-slider-mouse-down');
							if (Math.abs(referenceX - this.x) > opt.minDrag) {
								Draggable.get($slider).disable();
								direction = ((referenceX - this.x) > 0) ? -1 : 1;
								if (direction === 1) {
									gotoPrev();
								} else {
									gotoNext();
								}
							} else {
								update();
							}
						}
					});
					drag = Draggable.get($slider);
				} else {
					console.log('Draggable is not detected. You need to load it to enable drag. More info here : http://www.greensock.com/draggable/');
				}
			}

			/*********************************** FIRST UPDATE ***********************************/
			update();
			$window.load(function () {
				update();
			});

			/*********************************** ON INIT ***********************************/
			// TRIGGER ON INIT
			if (opt.onInit) {
				opt.onInit($items.eq(currentItem + numClones), total + 1, $this);
			}
			$this.addClass('extra-slider-processed').trigger('init.extra.slider', [$items.eq(currentItem + numClones), total + 1, $this]);
			gotoPage(0);
		});

		return this;

	};
}(jQuery));