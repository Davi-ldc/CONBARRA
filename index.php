<?php get_header() ?>
<main id="sccont" class="main" data-scroll-container>
  <div class="sec auto white">
    <div class="div-block-24">
      <h1 class="artigo-intro-txt">Artigos</h1>
      </div>
    <div class="div-block-25">

      <?php
        // Verifica se o PODS está ativo
        if ( function_exists( 'pods' ) ) {
          $params = array(
            'orderby' => 'post_date DESC', // Ordena pela data (mais recente primeiro)
            'limit' => -1 // Sem limite de itens
          );
          $pods = pods( 'artigos', $params );
          
          //se há artigos
          if ( $pods->total() > 0 ) :
        ?>
          <div class="artigoscms w-dyn-list">
            <div role="list" class="collection-list w-dyn-items">
              <?php
              // Loop dos artigos
              while ( $pods->fetch() ) :
                $titulo = $pods->display( 'post_title' );
                $autor = $pods->display( 'autores' );
                $data_publicacao = $pods->display( 'data_da_publicacao' );
                $imagem = $pods->display( 'imagem_na_vertical' );
                $conteudo = $pods->display( 'post_content' );
                $link = get_permalink( $pods->ID() );
              ?>
                <div role="listitem" class="artigo w-dyn-item">
                  <div class="artigowrap">
                    <div>
                      <a href="<?php echo esc_url( $link ); ?>" class="relative w-inline-block">
                        <div class="padding">
                          <div class="autores"><?php echo esc_html( $autor ); ?></div>
                          <div class="titulo"><?php echo esc_html( $titulo ); ?></div>
                          <div class="arrow-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 43 43" fill="none" class="arrow">
                              <path d="M33.9436 10.5584C33.619 15.7145 33.7632 22.5593 34.7728 26.8146L30.6295 27.641C29.9055 23.8939 29.8364 18.1277 30.7377 11.7515C24.2866 12.5779 18.5173 12.5057 14.8453 11.8568L15.6717 7.71345C19.8905 8.68694 26.7715 8.86734 31.9999 8.61465L33.9436 10.5584Z" fill="currentColor"></path>
                              <path d="M10.6187 34.0038L32.1855 12.9547L29.7765 10.5457L8.20967 31.5948L10.6187 34.0038Z" fill="currentColor"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="imgwrap">
                          <img src="<?php echo esc_url( $imagem ); ?>" loading="lazy" alt="<?php echo esc_attr( $titulo ); ?>" class="img-artigo">
                        </div>
                        <div class="darckoffset"></div>
                      </a>
                      <div class="date"><?php echo esc_html( date( 'j/n/y', strtotime( $data_publicacao ) ) ); ?></div>
                    </div>
                  </div>
                </div>
              <?php endwhile; ?>
            </div>
          </div>
        <?php
          else :
        ?>
          <div class="w-dyn-empty">
            <div>Nenhum artigo encontrado.</div>
          </div>
        <?php
          endif;
        }
        ?>


    </div>
  </div>
  <?php get_footer() ?>
</main>
</body>
</html>