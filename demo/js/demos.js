$(document).ready(function() {
	// simple
	$("#simple .extra-slider").extraSlider();
	
	// draggable
	$("#drag .extra-slider").extraSlider({
		'draggable': true,
		'paginate': false,
		'navigate': false,
	});
	
	// keyboard
	$("#keyboard .extra-slider").extraSlider({
		'keyboard': true,
		'paginate': false,
		'navigate': false,
	});
	
	// margin
	$("#margin .extra-slider").extraSlider({
		'margin': 1
	});
	
	// fade
	$("#fade .extra-slider").extraSlider({
		'type': 'fade'
	});
	
	// multiple
	$("#multiple .extra-slider").extraSlider({
		'paginate': false
	});
	
	// automatic
	var autoTween;
	$("#automatic .extra-slider").extraSlider({
		'auto': 5,
		'paginate': false,
		'navigate': false,
		'onInit': moveLoader,
		'onPause': movePause,
		'onResume': moveResume,
		'onMoveStart': moveLoader
	});
	function moveLoader(currentItem, total, slider) {
		autoTween = TweenMax.fromTo(slider.find('.loader'), 5, {width: 0}, {width: "100%"});
	}
	function movePause(currentItem, total, slider) {
		autoTween.pause();
	}
	function moveResume(currentItem, total, slider) {
		autoTween.resume();
	}
	
});

$(document).ready(function() {
	
	var $wrapper = $(".main-content"),
		$nav = $("#wrapper > .navigation"),
		$tabs = $wrapper.children(),
		current = $tabs.first();
		
	if(window.location.hash != "") {
		$hash = $(window.location.hash.replace("/",""));
		if($hash.length) {
			current = $hash;
		}
		
	}
		
	function updateTabs() {
		$tabs.not(current).hide().find('.extra-slider').trigger('pause');
		current.show();
		current.find('.extra-slider').trigger('update').trigger('resume');
		$nav.find('a').removeClass('active');
		$nav.find('a[href="#' + current.attr('id') + '"]').addClass('active');
		window.location.hash = '/' + current.attr('id');
	}
	
	$nav.find('a').on('click', function() {
		
		var link = $(this),
			target = $(link.attr('href'));
			current = target;
			updateTabs();
		
		return false;
		
	});
	
	// update
	updateTabs();
	
});