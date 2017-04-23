jQuery(document).ready(function($) {
	var typingTimer;              
	var doneTypingInterval = 1000;
	var $search_form = $('#searchform');
	var $search_input = $search_form.find('[name="s"]');

	$search_input.on('keyup change', function () {
	  clearTimeout(typingTimer);
	  if($search_input.val().length >= 3){
	  	typingTimer = setTimeout(doneTyping, doneTypingInterval);
	  }
	});
	$search_input.on('keydown', function () { clearTimeout(typingTimer); });

	function doneTyping () {
		$('#dropdown-search').remove();
		$search_form.append( $('<div id="dropdown-search" class="ajax-load"></div>') );

		var ajaxdata = {
			action: 'get_tax_suggestions',
			nonce: tax_suggestions.nonce,
			search_val: $search_input.val()
		};

		$.ajax({
			type: 'POST', url: tax_suggestions.url, data: ajaxdata,
			success: function(response){
				$('#dropdown-search').removeClass('ajax-load');
				$('#dropdown-search').append(response);
			}
		}).fail(function() {
			console.log('Ajax error!');
		});
	}
});