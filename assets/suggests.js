
/**
 * @global arrSuggProps (url, nonce, action)
 */

/**
 * support multi forms
 */
// use #searchform
// #searchform-dropdown-wrap > .searchform-dropdown
jQuery(document).ready(function($) {
	var suggestions = function( search_form_id ){
		var self = this;
		this.typingTimer = null;
		this.interval = 500;
		this.loadClass = 'ajax-load';

		var $search_form = $(search_form_id);
		var $search_input = $('[name="s"]', $search_form);
		var $suggWarp = $("<div id='searchform-dropdown' class='not-initialized'></div>");

		$search_form.append( $suggWarp );
		$search_input.attr('autocomplete', 'off');

		$search_input.on('keyup', function () {
			clearTimeout(self.typingTimer);
			$suggWarp.addClass(self.loadClass);

			if($search_input.val().length >= 2){
				self.typingTimer = setTimeout(doneTyping, self.interval);
			} else {
				$suggWarp.removeClass(self.loadClass);
			}
		});
		$search_input.on('keydown', function () { clearTimeout(self.typingTimer); });
		$(document).on('click', function(event) {
			if( $(event.target).closest( search_form_id ).length <= 0 )
				$suggWarp.addClass('not-initialized');
		});

		function doneTyping () {
			$suggWarp.removeClass('not-initialized');
			var search_val = $search_input.val();
			arrSuggProps.search_val = search_val.substr( 0, search_val.length - ((search_val.length >= 5) ? 2 : 1) );

			$.ajax({
				type: 'POST',
				url: arrSuggProps.url,
				data: arrSuggProps,
				success: function(response){
					$suggWarp.removeClass(self.loadClass);

					console.log(response);
					if(response && response != '0')
						$suggWarp.html('<ul class="search-dropdown">'+response+'</ul>');
				}
			}).fail(function() {
				console.log('AJAX Fatal error!');
			});
		}
	}
	new suggestions( '#searchform' );

});