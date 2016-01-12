/****************
 *
 *
 *
 * EXTRA SLIDER 2.0
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
            'direction': 'x',
            'draggable': false,
            'ease': Quad.easeOut,
            'forcedDimensions': true,
            'keyboard': false,
            'margin': 1,
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
                currentItem = opt.startAt,
                previousItem = total,
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
            

            /*********************************** INITIALIZE ***********************************/
            function initialize() {
                
                var tweenProperties = {};
                
                // set index
                $items.each(function (index) {
                    $(this).data('index', index);
                });
                
                // is slide
                if (opt.type === "slide") {
                    $this.addClass('extra-slider-slide');
                    updateClones();
                    $items.each(function (index, element) {
                        tweenProperties = {};
                        tweenProperties[opt.direction] = (index * 100) + '%';
                        TweenMax.set(element, tweenProperties);
                    });
                }
                
                // is fade
                else if (opt.type === "fade") {
                    $this.addClass('extra-slider-fade');
                    $items.each(function (i) {
                        if (i === currentItem) {
                            TweenMax.set($(this), {autoAlpha: 1, zIndex: 2});
                        } else {
                            TweenMax.set($(this), {autoAlpha: 0, zIndex: 1});
                        }
                    });
                }
            }

            /*********************************** UPDATE ***********************************/
            function update() {
                
                if (opt.forcedDimensions) {
                    $slider.css({
                        width: 'auto',
                        height: 'auto'
                    }).width($items.first().width()).height($items.first().height());
                }

                // POSITION AND WIDTH
                if (opt.type === 'slide') {
                    adjustPosition();
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

            /*********************************** FUNCTIONS ***********************************/
            // adjust the slider position
            function adjustPosition() {
                
                if(opt.type === 'slide' && $slider[0]._gsTransform === undefined) {
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
                
                if(needAdjustement && opt.type === 'slide') {        
                    currentPosition = $slider[0]._gsTransform[opt.direction + 'Percent'];
                    targetPosition = -(currentItemReference + numClones);
                    targetPosition *= 100;
                    delta = targetPosition - currentPosition;
                    position = -(((currentItem + numClones) * 100) + delta);
                    tweenProperties[opt.direction + 'Percent'] = position;
                    TweenMax.set($slider, tweenProperties);
                }
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

                time = (time !== undefined) ? time : opt.speed;

                var position,
                    tweenProperties = {
                        onComplete: endHandler,
                        onCompleteParams: [time],
                        ease: opt.ease
                    };

                $items.removeClass('active');

                previousItem = currentItem;
                currentItem = parseInt(newPage, 10);
                
                adjustPosition();
                
                if (opt.onMoveStart && time > 0) {
                    opt.onMoveStart($items.eq(currentItem + numClones), total + 1, $this);
                }
                $this.trigger('extra:slider:moveStart', [$items.eq(currentItem + numClones), total + 1, $this]);

                if (opt.paginate) {
                    $pagination.each(function () {
                        $(this).find("a").removeClass("active").eq(currentItem).addClass("active");
                    });
                }

                if (opt.type === "slide") {
                    position = -(currentItem + numClones);
                    position = position * 100;
                    tweenProperties[opt.direction + 'Percent'] = position;
                    TweenMax.to($slider, time, tweenProperties);
                } else if (opt.type === "fade") {
                    $items.eq(previousItem).css("zIndex", 1);
                    tweenProperties.autoAlpha = 1;
                    TweenMax.to($items.eq(currentItem).show().css("zIndex", 2), time, tweenProperties);
                }
            }

            function updateClones() {

                // REMOVE ALL CLONES
                $items.find('.cloned').remove();

                // CLONE BEFORE
                $items.first().before($items.slice(-opt.margin).clone(true).addClass('cloned'));

                // CLONE AFTER
                $items.last().after($items.slice(0, opt.margin).clone(true).addClass('cloned'));

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
            if (opt.navigate || $navigation.length) {
                if (!$navigation.length) {
                    $navigation = $('<div class="navigation"><a href="#" class="prev">Previous</a><a href="#" class="next">Next</a></div>').insertAfter($wrapper);
                }
                $('a.prev', $navigation).on("click", function (event) {
                    event.preventDefault();
                    gotoPrev();
                });
                $('a.next', $navigation).on("click", function (event) {
                    event.preventDefault();
                    gotoNext();
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
                        type: opt.direction,
                        cursor: 'move',
                        lockAxis: false,
                        throwProps: true,
                        zIndexBoost: false,
                        
                        onDragStart: function () {
                            // Get the width to be able to convert pixel to percents
                            singleWidth = $items.first().width();
                            
                            // Events
                            if (opt.onDragStart) {
                                opt.onDragStart($items.eq(currentItem + numClones), total + 1, $this);
                            }
                            $this.trigger('extra:slider:onDragStart', [$items.eq(currentItem + numClones), total + 1, $this]);
                        },
                        
                        onDragEnd: function () {
                            
                            // Position, from pixels to percent
                            var realPosition = (drag[opt.direction] / singleWidth * 100) - ((currentItem - numClones) * 100),
                                draggedPage = -(realPosition / 100 - numClones),
                                targetPage,
                                tweenProperties = {},
                                position;
                            
                            // Check minimum drag amount to change slide
                            if(opt.minDrag > 0 && Math.abs(drag[opt.direction]) <= opt.minDrag) {
                                targetPage = currentItem;
                            } 
                            
                            // Make sure it doesn't come back in place
                            else if(draggedPage > currentItem) {
                                targetPage = Math.ceil(draggedPage);
                            } else {
                                targetPage = Math.floor(draggedPage);
                            }
                            
                            // Get position in percent
                            position = -(draggedPage + numClones);
                            position = position * 100;
                            
                            // Set pixel position to 0
                            tweenProperties[opt.direction] = 0;
                            TweenMax.set($slider, tweenProperties);
                            
                            // Set percent position according to position
                            tweenProperties = {};
                            tweenProperties[opt.direction + 'Percent'] = position;
                            TweenMax.set($slider, tweenProperties);
                            
                            // Update drag for next time
                            drag.update();
                            
                            // Go to correct page
                            gotoPage(targetPage);
                            
                            // Events
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

            /*********************************** INIT ***********************************/
            initialize();
            update();
            
            // Events
            if (opt.onInit) {
                opt.onInit($items.eq(currentItem + numClones), total + 1, $this);
            }
            $this.addClass('extra-slider-processed').trigger('extra:slider:init', [$items.eq(currentItem + numClones), total + 1, $this]);
            gotoPage(currentItem);
        });

        return this;

    };
}(jQuery));