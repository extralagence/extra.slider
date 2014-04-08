/****************
 *
 *
 *
 * EXTRA SLIDER 1.0
 *
 *
 *
http://slider.extralagence.com
 */
(function ($) {
    'use strict';
    /*global console, jQuery, $, window, TweenMax, Draggable */
    var $window = window.$window || $(window);

    $.fn.extraSlider = function (options) {

        var opt = $.extend({
            'auto': false,
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
            'onMoveEnd': null,
            'onPause': null,
            'onResume': null
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
                singleWidth = 0,
                singleHeight = 0,
                total = $items.length,
                visible = Math.ceil($wrapper.width() / singleWidth),
                currentItem = 1,
                previousItem = total,
                i = 0,
                // AUTOMATIC
                autoTween,
                // DRAG
                drag,
                reference = 0,
                direction;
            /*********************************** FUNCTIONS ***********************************/
            // adjust the slider position
            function adjustPosition() {
                if (currentItem >= total) {
                    // too far on the left (previous)
                    currentItem = 0;
                    TweenMax.set($slider, {css: {left: -(singleWidth * (currentItem + numClones))}});
                } else if (currentItem < 0) {
                    // too far on the right (next)
                    currentItem = total - 1;
                    TweenMax.set($slider, {css: {left: -(singleWidth * (currentItem + numClones))}});
                }
            }
            // get the blocs dimensions
            function getDimension(type) {
                var max = 0,
                    item,
                    current;
                $items.each(function () {
                    item = $(this);
                    current = (type === 'height') ? item.outerHeight(true) : item.outerWidth(true);
                    if (current > max) {
                        max = current;
                    }
                });
                return max;
            }
            // when the first animation is finished
            function endHandler(time) {
                // endHandler for slide
                if (opt.type === "slide") {
                    adjustPosition();
                    if (opt.draggable && opt.type === 'slide' && drag !== undefined) {
                        Draggable.get($slider).enable();
                    }
                }

                // set active
                $items.eq(currentItem + numClones).addClass('active');

                // listener
                if (opt.onMoveEnd && time > 0) {
                    opt.onMoveEnd(currentItem, total, $this, $items.eq(currentItem + numClones));
                }
            }

            /*********************************** GO TO PAGE ***********************************/
            function gotoPage(newPage, time) {

                time = (time !== undefined) ? time : opt.speed;

                var dir = newPage < currentItem ? -1 : 1,
                    left;

                $items.removeClass('active');

                if (!TweenMax.isTweening($slider) && !TweenMax.isTweening($items)) {

                    previousItem = currentItem;
                    currentItem = parseInt(newPage, 10);

                    if (opt.type === 'fade') {
                        if (currentItem === total && dir === 1) {
                            currentItem = 0;
                        } else if (currentItem === 0  && dir === -1) {
                            currentItem = total;
                        }
                    }

                    if (opt.onMoveStart && time > 0) {
                        opt.onMoveStart(currentItem, total, $this);
                    }

                    if (opt.paginate) {
                        $pagination.find("a").removeClass("active").eq(currentItem - 1).addClass("active");
                    }

                    switch (opt.type) {
                    case "slide":
                        left = -(singleWidth * (currentItem + numClones));
                        TweenMax.to($slider, time, {css: {left: left}, onComplete: endHandler, onCompleteParams: [time]});
                        break;
                    case "fade":
                        TweenMax.to($items.eq(previousItem - 1).css("zIndex", 1), time, {css: {autoAlpha: 0}});
                        TweenMax.to($items.eq(currentItem - 1).css("zIndex", 2), time, {css: {autoAlpha: 1}, onComplete: endHandler, onCompleteParams: [time]});
                        break;
                    }
                }
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

                if (opt.type === 'slide') {
                    // SET DIMENSIONS
                    $slider.width(99999);
                    TweenMax.set($slider, {css: {left: -(singleWidth * (currentItem + numClones))}});
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

                // ACTIVE CLASS
                $items.removeClass('active');
                $items.eq(currentItem + numClones).addClass('active');

            }

            /*********************************** HELPER FUNCTIONS ***********************************/
            function gotoNext(time) {
                time = (time !== undefined) ? time : opt.speed;
                gotoPage(currentItem + 1, time);
            }
            function gotoPrev(time) {
                time = time !== undefined ? time : opt.speed;
                gotoPage(currentItem - 1, time);
            }
            // auto slide
            function autoSlide() {
                autoTween = TweenMax.delayedCall(opt.auto, function () {
                    gotoNext();
                    autoSlide();
                });
            }

            /*********************************** SETUP VARS ***********************************/
            singleWidth = getDimension('width');
            singleHeight = getDimension('height');

            /*********************************** INITIALIZE ***********************************/
            switch (opt.type) {
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
                    if (i === 0) {
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
                $window.on('resize', function () {
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
                for (i = 0; i < total; i += 1) {
                    $("<a>", {'href': '#'}).html(opt.paginateContent !== '' ? opt.paginateContent : i + 1).appendTo($pagination);
                }
                $pagination.find("a").removeClass("active").eq(currentItem - 1).addClass("active");
                $('a', $pagination).each(function (i) {
                    $(this).click(function () {
                        if (i + 1 !== currentItem) {
                            gotoPage(i + 1);
                        }
                        return false;
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
                    autoTween.pause();
                }).on('mouseleave resume', function () {
                    // listener
                    if (opt.onResume) {
                        opt.onResume($this);
                    }
                    autoTween.resume();
                });
            }

            /*********************************** DRAGGABLE ***********************************/
            if (opt.draggable && opt.type === 'slide') {

                $this.addClass('extra-slider-draggable');

                if (Draggable !== undefined) {
                    drag = Draggable.create($slider, {
                        type: "left",
                        cursor: 'move',
                        onDragStart: function () {
                            $this.addClass('extra-slider-mouse-down');
                            reference = parseFloat($slider.css('left'));
                        },
                        onDragEnd: function () {
                            Draggable.get($slider).disable();
                            direction = ((reference - this.x) > 0) ? -1 : 1;
                            $this.removeClass('extra-slider-mouse-down');
                            if (direction === 1) {
                                gotoPrev();
                            } else {
                                gotoNext();
                            }
                        }
                    });
                } else {
                    console.log('Draggable is not detected. You need to load it to enable drag. More info here : http://www.greensock.com/draggable/');
                }
            }

            /*********************************** ON INIT ***********************************/
            // TRIGGER ON INIT
            if (opt.onInit) {
                opt.onInit(currentItem, total, $this);
            }

            /*********************************** FIRST UPDATE ***********************************/
            update();
            $window.load(function () {
                update();
            });

        });

        return this;

    };
}(jQuery));