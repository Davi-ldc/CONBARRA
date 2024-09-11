<?php get_header() ?>
<main class="main nopad" id="sccont" data-scroll-container>
  <div class="artigos-hero">
    <div class="artigos-hero-bg">
      <?php 
        if ( function_exists( 'pods' ) ) {
            $pod = pods('artigos', get_the_ID());
            $imagem = $pod->display('imagem_na_vertical');
        }
        ?>
        <img loading="lazy" src="<?php echo esc_url($imagem); ?>" alt="<?php the_title_attribute(); ?>" class="image-2">

      <div class="black-overlay"></div>
    </div>
    <div class="artigos-hero-content-wrap">
      <h1 class="titulo-artigo-2"><?php the_title(); ?></h1>
      <div class="informa-es-wrap-2">
        <div class="autor-wrap-2">
          <div class="opacidade-50 white" style="margin-top:auto; margin-bottom:auto;">Escrito por&nbsp;</div>
          <div><?php echo esc_html(get_post_meta(get_the_ID(), 'autores', true)); ?></div>
        </div>
        <div class="dot white hidemobile"></div>
        <div class="data-wrap">
          <div class="opacidade-50 white" style="margin-top:auto; margin-bottom:auto;">Em&nbsp;</div>
          <div><?php echo esc_html(date_i18n('j \d\e F \d\e Y', strtotime(get_post_meta(get_the_ID(), 'data_da_publicacao', true)))); ?></div>
        </div>
      </div>
      <a href="<?php echo get_permalink(); ?>#Conteudo" class="proxima-se-o w-inline-block">
        <div class="white-bg"></div>
        <img loading="lazy" src="<?php echo get_template_directory_uri(); ?>/assets/images/arrow-black-bold.svg" alt="Seta para esquerda preta" class="icon arrow-down">
      </a>
    </div>
  </div>
  <div id="Conteudo" class="conte-do-artigos">
    <div class="conteudo-wrap">
      <div class="conte-do w-richtext">
        <?php
        the_content();
        ?>
      </div>
    </div>
  </div>

<?php get_footer(); ?>
</main>
</body>
</html>
