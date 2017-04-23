<?php
/**
 * Plugin Name: Search Taxonomy Suggest
 * Plugin URI: 
 * Description: Helps to find taxanomy through a search
 * Version: 0.1
 * Author: NikolayS93
 * Author URI: https://vk.com/nikolays_93
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

//define('SUGG_DIR', plugin_dir_path( __FILE__ ));
define('SUGG_NONCE', 'any_secret_string');
define('SUGG_VER', '1.0');


add_action( 'wp_enqueue_scripts', 'tax_suggestions_js', 99 );
function tax_suggestions_js(){
	wp_enqueue_script( 'search-taxonomy-suggest', plugins_url( basename(__DIR__) . '/suggests.js' ), array('jquery'), SUGG_VER, true );
	wp_localize_script('search-taxonomy-suggest', 'tax_suggestions', 
		array(
			'url' => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce( SUGG_NONCE )
		)
	);  
}


add_action('wp_ajax_nopriv_my_action', 'suggest_dropdown');
add_action('wp_ajax_get_tax_suggestions', 'suggest_dropdown');
function suggest_dropdown() {
	if( ! wp_verify_nonce( $_POST['nonce'], SUGG_NONCE ) ){
		echo 'Ошибка! нарушены правила безопасности';
		wp_die();
	}

	$terms = get_terms( array(
		'taxonomy'=> 'product_cat',
		//'hide_empty' => '0'
		) );

	if( is_array($terms) && sizeof($terms) >= 1 ){
		$terms = array_filter($terms , function($var){
			return preg_match( "/".sanitize_text_field( $_POST['search_val'] )."/ui", $var->name, $output);
		});

		foreach ($terms as $term) {
			$link = get_term_link( $term->term_id, $term->taxonomy );

			echo "<a href='{$link}'>{$term->name}</a>";
		}
	}

	wp_die();
}