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
		paginate: false
	});
	
	// automatic
	$("#automatic .extra-slider").extraSlider({
		'auto': 5
	});
	
});

$(document).ready(function() {
	
	var $wrapper = $(".main-content"),
		$nav = $(".main-navigation"),
		$tabs = $wrapper.children(),
		current = $tabs.first();
		
	if(window.location.hash != "") {
		$hash = $(window.location.hash); 
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