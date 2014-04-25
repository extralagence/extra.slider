$(document).ready(function() {
	/*********************
	 *
	 * BACK TO TOP
	 *
	 *********************/
	$(".totop").click(function () {
		TweenMax.to($(window), 0.5, {scrollTo: {y: 0}});
		return false;
	});

	$("#main-nav .download").on('click', function() {
		if(typeof ga == 'function'){
			ga('send', 'event', 'download', 'click');
		}
	});
});