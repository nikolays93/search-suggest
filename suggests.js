
// use #searchform
// #searchform-dropdown-wrap > .searchform-dropdown
jQuery(document).ready(function($) {
	var typingTimer, doneTypingInterval = 500;

	var $search_form = $('#searchform');
	var $search_input = $('[name="s"]', $search_form);
	var wrap_id = '#searchform-dropdown-wrap';

	$search_form.append( '<div id="'+ wrap_id.replace('#', '') + '"></div>' );
	$search_input.attr('autocomplete', 'off');

	$search_input.on('keyup', function () {
	  clearTimeout(typingTimer);
	  $(wrap_id).addClass('ajax-load');

	  if($search_input.val().length >= 2){
	  	typingTimer = setTimeout(doneTyping, doneTypingInterval);
	  } else {
	  	$(wrap_id).removeClass('ajax-load');
	  	$(wrap_id).html('');
	  }
	});
	$search_input.on('keydown', function () { clearTimeout(typingTimer); });

	function doneTyping () {
		var ajaxdata = {
			action: 'get_tax_suggestions',
			nonce: tax_suggestions.nonce,
		};
		var search_val = $search_input.val();

		var del = search_val.length >= 5 ? 2 : 1;
		ajaxdata.search_val = search_val.substr( 0, search_val.length - del );
		
		$.ajax({
			type: 'POST', url: tax_suggestions.url, data: ajaxdata,
			success: function(response){
				$(wrap_id).removeClass('ajax-load');

				if(response && response != '0')
					$(wrap_id).html('<div class="searchform-dropdown">'+response+'</div>');
			}
		}).fail(function() {
			console.log('Ajax error');
		});
	}
});


