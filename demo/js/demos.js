$(document).ready(function() {
	// simple
	$("#simple .extra-slider").extraSlider();
	
	// draggable
	$("#drag .extra-slider").extraSlider({
		'draggable': true
	});
	
	// keyboard
	$("#keyboard .extra-slider").extraSlider({
		'keyboard': true
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
		autoTween = TweenMax.from(slider.find('.loader'), 5, {width: 0});
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
		$tabs.not(current).hide();
		current.show();
		current.find('.extra-slider').trigger('update');
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