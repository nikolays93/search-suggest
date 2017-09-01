
/**
 * @global arrSuggProps (url, nonce, action)
 */

/**
 * support multi forms
 */
// use #searchform
// #searchform-dropdown-wrap > .searchform-dropdown
jQuery(document).ready(function($) {


	var suggestions = function( search_form_query ){
		var self = this;
		this.typingTimer = null;
		this.interval = 500;
		this.loadClass = 'ajax-load';

		var $search_form = $(search_form_query);
		var $search_input = $('[name="s"]', $search_form);
		var $suggWarp = $("<div id='searchform-dropdown'></div>");

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

		function doneTyping () {
			var search_val = $search_input.val();
			arrSuggProps.search_val = search_val.substr( 0, search_val.length - ((search_val.length >= 5) ? 2 : 1) );

			$.ajax({
				type: 'POST',
				url: arrSuggProps.url,
				data: arrSuggProps,
				success: function(response){
					$suggWarp.removeClass(self.loadClass);

					if(response && response != '0')
						$suggWarp.html('<ul class="search-dropdown">'+response+'</ul>');
				}
			}).fail(function() {
				console.log('Ajax error');
			});
		}
	}
	new suggestions( '#searchform' );

});