<?php
function styles() {
	wp_enqueue_style(
		'normalize',
		get_template_directory_uri() . '/assets/css/normalize.css',
		array(),
		'1.0'
	);
	wp_enqueue_style(
		'webflow',
		get_template_directory_uri() . '/assets/css/webflow.css',
		array(),
		'1.0'
	);
	wp_enqueue_style(
		'conbarra',
		get_template_directory_uri() . '/assets/css/conbarra.webflow.css',
		array(),
		'1.0'
	);
	wp_enqueue_style(
		'swiper',
		'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
		array(),
		'11.0'
	);
}


add_action( 'wp_enqueue_scripts', 'styles' );

function scripts() {

    wp_enqueue_script(
        'locomotive-scroll',
        'https://cdn.jsdelivr.net/npm/locomotive-scroll@3.6.1/dist/locomotive-scroll.min.js',
        array(),
        '3.6.1',
        false
    );

    // GSAP
    wp_enqueue_script(
        'gsap',
        'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
        array(),
        '3.12.5',
        false
    );

    // ScrollTrigger
    wp_enqueue_script(
        'scrollTrigger',
        'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',
        array('gsap'),
        '3.12.5',
        false
    );

    // CustomEase
    wp_enqueue_script(
        'customEase',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/CustomEase.min.js',
        array('gsap'),
        '3.10.4',
        false
    );

    // FontFaceObserver
    wp_enqueue_script(
        'fontfaceobserver',
        'https://cdnjs.cloudflare.com/ajax/libs/fontfaceobserver/2.1.0/fontfaceobserver.js',
        array(),
        '2.1.0',
        false
    );

    // SplitType
    wp_enqueue_script(
        'split-type',
        'https://cdn.jsdelivr.net/gh/timothydesign/script/split-type.js',
        array(),
        '1.0',
        false
    );

    // Swiper
    wp_enqueue_script(
        'swiper',
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
        array(),
        '11.0.0',
        false
    );

	
}
add_action( 'wp_enqueue_scripts', 'scripts' );