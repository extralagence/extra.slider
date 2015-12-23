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
    var $window = $(window);

    $.fn.extraSlider = function (options) {

        var opt = $.extend({
            'auto': false,
            'draggable': false,
            'ease': Quad.easeOut,
            'forcedDimensions': true,
            'keyboard': false,
            'margin': 0,
            'minDrag': 0,
            'navigate': true,
            'navigation': null,
            'paginate': true,
            'pagination': null,
            'paginateContent': '',
            'resizable': true,
            'resizeEvent': 'resize',
            'speed': 0.5,
            'startAt': 0,
            'type': 'slide',
            'onGotoNext': null,
            'onGotoPrev': null,
            'onInit': null,
            'onMoveEnd': null,
            'onMoveStart': null,
            'onPause': null,
            'onResume': null,
            'onUpdate': null,
            'onDragStart': null,
            'onDragEnd': null,
            'onDragRepositioned': null
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
                currentItem = opt.startAt,
                previousItem = total,
                offset = 0,
                i = 0,
            // AUTOMATIC
                autoTween,
            // DRAG
                drag,
                startX,
                startItem;

            // Adjust margin in case there is draggable involved
            if (opt.draggable) {
                opt.margin += 1;
            }

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
                var left = -(totalWidth * currentItem + (numClones * singleWidth));
                TweenMax.set($slider, {x: left});
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
                $this.trigger('extra:slider:moveEnd', [$items.eq(currentItem + numClones), total + 1, $this]);
            }

            /*********************************** GO TO PAGE ***********************************/
            function gotoPage(newPage, time) {

                if (newPage === currentItem) {
                    return;
                }

                time = (time !== undefined) ? time : opt.speed;

                var realCurrentItem,
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
                    $this.trigger('extra:slider:moveStart', [$items.eq(currentItem + numClones), total + 1, $this]);

                    if (opt.paginate) {
                        $pagination.each(function () {
                            $(this).find("a").removeClass("active").eq(realCurrentItem).addClass("active");
                        });
                    }

                    if (opt.type === "slide") {
                        left = -(totalWidth * currentItem + (numClones * singleWidth));
                        if (offset !== 0) {
                            if (currentItem > total) {
                                left += singleWidth * offset;
                            }
                            if (currentItem < 0) {
                                left -= singleWidth * offset;
                            }
                        }
                        TweenMax.to($slider, time, {
                            x: left,
                            onComplete: endHandler,
                            onCompleteParams: [time],
                            ease: opt.ease
                        });
                    } else if (opt.type === "fade") {
                        $items.eq(previousItem).css("zIndex", 1);
                        TweenMax.to($items.eq(currentItem).show().css("zIndex", 2), time, {
                            css: {autoAlpha: 1},
                            onComplete: endHandler,
                            onCompleteParams: [time, $items.eq(previousItem)]
                        });
                    }
                }
            }

            /*********************************** UPDATE ***********************************/
            function update() {

                var newVisible;

                if (opt.forcedDimensions) {
                    // RESET DIMENSIONS
                    TweenMax.set($slider, {
                        clearProps: "width"
                    });
                    TweenMax.set([$slider, $items, $wrapper], {
                        clearProps: "width,height"
                    });
                }

                // GET DIMENSIONS
                // TODO: one call
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
                        'width': singleWidth + 'px',
                        'height': singleHeight + 'px'
                    });
                    $wrapper.css({
                        'width': totalWidth + 'px',
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
                $this.trigger('extra:slider:update', [$items.eq(currentItem + numClones), total + 1, $this]);

                if (drag) {
                    drag.update();
                }

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
                $this.trigger('extra:slider:updateClones', [$items.eq(currentItem + numClones), total + 1, $this]);
            }

            /*********************************** HELPER FUNCTIONS ***********************************/
            function gotoNext(time) {
                if (opt.onGotoNext) {
                    opt.onGotoNext($this);
                }
                $this.trigger('extra:slider:onGotoNext', [$items.eq(currentItem + numClones), total + 1, $this]);
                time = (time !== undefined) ? time : opt.speed;
                gotoPage(currentItem + 1, time);
            }

            function gotoPrev(time) {
                if (opt.onGotoPrev) {
                    opt.onGotoPrev($this);
                }
                $this.trigger('extra:slider:onGotoPrev', [$items.eq(currentItem + numClones), total + 1, $this]);
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
            $items.each(function (index) {
                $(this).data('index', index);
            });
            singleWidth = getDimension('width');
            singleHeight = getDimension('height');

            /*********************************** INITIALIZE ***********************************/
            if (opt.type === "slide") {
                $this.addClass('extra-slider-slide');
            } else if (opt.type === "fade") {
                $this.addClass('extra-slider-fade');
                $items.each(function (i) {
                    if (i === currentItem) {
                        TweenMax.set($(this), {css: {autoAlpha: 1, zIndex: 2}});
                    } else {
                        TweenMax.set($(this), {css: {autoAlpha: 0, zIndex: 1}});
                    }
                });
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
                $window.on(opt.resizeEvent, function () {
                    update();
                });
            }

            /*********************************** NAVIGATION ***********************************/
            if (opt.navigate) {
                if (!$navigation.length) {
                    $navigation = $('<div class="navigation"><a href="#" class="prev">Previous</a><a href="#" class="next">Next</a></div>').insertAfter($wrapper);
                }
                $('a.prev', $navigation).on("click", function () {
                    gotoPrev();
                    return false;
                });
                $('a.next', $navigation).on("click", function () {
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
                    $this.trigger('extra:slider:pause', [$items.eq(currentItem + numClones), total + 1, $this]);
                    autoTween.pause();
                }).on('mouseleave resume', function () {
                    // listener
                    if (opt.onResume) {
                        opt.onResume($this);
                    }
                    $this.trigger('extra:slider:resume', [$items.eq(currentItem + numClones), total + 1, $this]);
                    autoTween.resume();
                });
            }

            /*********************************** DRAGGABLE ***********************************/
            if (opt.draggable && opt.type === 'slide') {

                $this.addClass('extra-slider-draggable');

                if (Draggable !== undefined) {
                    Draggable.create($slider, {
                        type: 'x',
                        cursor: 'move',
                        lockAxis: false,
                        throwProps: true,
                        zIndexBoost: false,
                        onDrag: function () {
                            var draggedPage = ((-(drag.x / singleWidth)) - numClones),
                                targetPage,
                                left;
                            if (draggedPage % (total + 1) < 0 || (draggedPage >= total + 1)) {
                                if (draggedPage % (total + 1) < 0) {
                                    draggedPage = draggedPage % (total + 1);
                                }
                                targetPage = draggedPage < 0 ? total + (1 + draggedPage) : draggedPage - (total + 1);
                                left = -(totalWidth * targetPage + (numClones * singleWidth));
                                if (offset !== 0) {
                                    if (targetPage > total) {
                                        left += singleWidth * offset;
                                    }
                                    if (targetPage < 0) {
                                        left -= singleWidth * offset;
                                    }
                                }
                                TweenMax.set($slider, {
                                    x: left
                                });
                            }
                        },
                        onDragStart: function () {
                            drag.update();
                            startX = drag.x;
                            startItem = currentItem;
                            if (opt.onDragStart) {
                                opt.onDragStart($items.eq(currentItem + numClones), total + 1, $this);
                            }
                            $this.trigger('extra:slider:onDragStart', [$items.eq(currentItem + numClones), total + 1, $this]);
                        },
                        onDragEnd: function () {
                            var dragX = drag.x,
                                draggedPage,
                                roundedDraggedPage,
                                left;
                            drag.update();
                            draggedPage = ((-(drag.x / singleWidth)) - numClones);
                            roundedDraggedPage = Math.round(draggedPage);
                            if (Math.abs(dragX - startX) < opt.minDrag) {
                                if (roundedDraggedPage >= total) {
                                    roundedDraggedPage = total + 1;
                                } else {
                                    roundedDraggedPage = startItem;
                                }
                            } else if (dragX < startX) {
                                if ((startItem % (total + 1)) === (roundedDraggedPage % (total + 1))) {
                                    roundedDraggedPage += 1;
                                }
                            } else {
                                if ((startItem % (total + 1)) === (roundedDraggedPage % (total + 1))) {
                                    roundedDraggedPage -= 1;
                                }
                            }
                            left = -(totalWidth * roundedDraggedPage + (numClones * singleWidth));
                            if (offset !== 0) {
                                if (roundedDraggedPage > total) {
                                    left += singleWidth * offset;
                                }
                                if (roundedDraggedPage < 0) {
                                    left -= singleWidth * offset;
                                }
                            }
                            currentItem = roundedDraggedPage;
                            TweenMax.to($slider, opt.speed, {
                                x: left,
                                ease: opt.ease,
                                onComplete: function () {
                                    update();
                                    if (opt.onDragRepositioned) {
                                        opt.onDragRepositioned($items.eq(currentItem + numClones), total + 1, $this);
                                    }
                                    $this.trigger('extra:slider:onDragRepositioned', [$items.eq(currentItem + numClones), total + 1, $this]);
                                }
                            });
                            if (opt.onDragEnd) {
                                opt.onDragEnd($items.eq(currentItem + numClones), total + 1, $this);
                            }
                            $this.trigger('extra:slider:onDragEnd', [$items.eq(currentItem + numClones), total + 1, $this]);
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
            $this.addClass('extra-slider-processed').trigger('extra:slider:init', [$items.eq(currentItem + numClones), total + 1, $this]);
            gotoPage(0);
        });

        return this;

    };
}(jQuery));