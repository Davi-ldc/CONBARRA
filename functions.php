<?php

define( 'TT_FUNCTIONS', get_template_directory() . '/inc' );

require_once(TT_FUNCTIONS . '/init.php');

//remove a aba "Posts" do menu de administração
function remove_menu_posts() {
    remove_menu_page('edit.php');
}
add_action('admin_menu', 'remove_menu_posts');


function add_fixado_column($columns) {
    // Adiciona uma nova coluna após o título
    $columns['fixado'] = 'Fixado';
    return $columns;
}
add_filter('manage_blog_post_posts_columns', 'add_fixado_column');

// Preenche a coluna
function fill_fixado_column($column, $post_id) {
    if ($column == 'fixado') {
        // Obtém o valor
        $is_fixado = get_post_meta($post_id, 'fixado', true);

        // Exibe o status
        if ($is_fixado && $is_fixado == '1') {
            echo 'Sim';
        } else {
            echo 'Não';
        }
    }
}
add_action('manage_blog_post_posts_custom_column', 'fill_fixado_column', 10, 2);

// Torna a coluna "Fixado" ordenável
function make_fixado_column_sortable($columns) {
    $columns['fixado'] = 'fixado';
    return $columns;
}
add_filter('manage_edit-blog_post_sortable_columns', 'make_fixado_column_sortable');

// Modifica a query para ordenar pela coluna "Fixado"
function fixado_column_orderby($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }

    $orderby = $query->get('orderby');
    
    if ('fixado' == $orderby) {
        // Define a ordenação pela meta key "fixado"
        $query->set('meta_key', 'fixado');
        $query->set('orderby', 'meta_value'); // Ordena pelo valor da meta key
    }
}
add_action('pre_get_posts', 'fixado_column_orderby');
