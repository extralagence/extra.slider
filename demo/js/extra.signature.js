jQuery(document).ready(function($) {
	
	$(".extra-signature").each(function() {
		var $parent = $(this),
			$list = $parent.find('.extra-signature-list'),
			$words = $list.find('>li'),
			h = $list.height(),
			current = 1,
			max = $words.length;

		// CLONE AFTER
		$words.last().after($words.slice(0, 1).clone().addClass('cloned'));
		
		function animate() {
			TweenMax.to($list, 0.5, {scrollTo:{y: h * current}, delay: 2.5, ease: Back.easeInOut, onComplete: function(){
				current++;
				if(current > max) {
					current = 1;
					$list.scrollTop(0);
				}
				animate();
			}});
		}
		animate();
	});
	
});
