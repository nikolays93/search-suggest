<?php
/**
 * Plugin Name: Search Suggest
 * Plugin URI:
 * Description: Helps to find stuff through a search
 * Version: 0.2a
 * Author: NikolayS93
 * Author URI: https://vk.com/nikolays_93
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

if( !class_exists('SearchSuggestions') ):
class SearchSuggestions // extends AnotherClass
{
	// const FILE = __FILE__;
	const SECRET_NONCE = 'nonce';
	const VER = '0.2';
	const ACTION = 'get_suggestions';

    private function __construct(){}

    static function init()
    {
    	add_action( 'wp_enqueue_scripts', array(__CLASS__, 'ajax_query_script') );

    	add_action('wp_ajax_nopriv_' . self::ACTION, array(__CLASS__, 'ajax_query_result'));
    	add_action('wp_ajax_' . self::ACTION, array(__CLASS__, 'ajax_query_result'));
    }

	static function ajax_query_script()
	{
		wp_enqueue_style( 'SearchSuggestions', plugins_url( basename(__DIR__) . '/assets/suggests.css' ), array(), self::VER );
		wp_enqueue_script( 'SearchSuggestions', plugins_url( basename(__DIR__) . '/assets/suggests.js' ), array('jquery'), self::VER, true );
		wp_localize_script('SearchSuggestions', 'arrSuggProps',
			array(
				'url'    => admin_url('admin-ajax.php'),
				'nonce'  => wp_create_nonce( self::SECRET_NONCE ),
				'action' => self::ACTION,
			)
		);
	}

	static function ajax_query_result()
	{
		if( ! wp_verify_nonce( $_POST['nonce'], self::SECRET_NONCE ) ) {
			wp_die('Fatal error. Troubles with security.');
		}

		$query = new WP_Query( array(
			'post_type' => 'post',
			'posts_per_page' => -1,
			//'order'   => 'DESC', // or ASC
			//'orderby' => 'comment_count'
			) );

		$result = '';
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();

				$title = get_the_title();
				if( preg_match( "/".sanitize_text_field( $_POST['search_val'] )."/ui", $title) ) {
					$result .= "\r\n<li>";
					$result .= '<a href="'.get_permalink().'">';
					$result .= get_the_post_thumbnail(get_the_id(), 'thubnail');
					$result .= '<h4>' . $title . '</h4>';
					$result .= '<span>' . get_the_excerpt() . '</span>';
					$result .= "</a></li>";
				}
			}
		}
		if( ! $result ) {
			$result = '<li><a>Извините, но по вашему запросу ничего не найдено</a></li>';
			// $result = __('Sorry, but for you query nothing found.');
		}
		echo $result;
		wp_reset_postdata();
		wp_die();
	}
}
endif;

add_action( 'plugins_loaded', array('SearchSuggestions', 'init') );
