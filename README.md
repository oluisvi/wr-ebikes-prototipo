# WR E-Bikes — protótipo de catálogo

Vitrine estática em uma página, com três direções de design selecionáveis: **Rota**, **Performance** e **Oficina**. A proposta combina preto, branco e vermelho, com atendimento consultivo e oficina informados pelo Guilherme na conversa com o Luiz.

## Abrir

Abra index.html em um navegador. Não precisa de build nem de dependências de runtime. O seletor no topo alterna os estilos; busca e filtros organizam a vitrine.

## Conteúdo e limites

- O botão de contato abre o WhatsApp comercial usado pela WR na conversa com o Guilherme e prepara um texto. A página não envia mensagens automaticamente.
- Atendimento consultivo, oferta de fotos adicionais e oficina vêm da transcrição da conversa compartilhada pelo Luiz.
- Não apresentamos preço, estoque, especificações, garantia, endereço ou horário como fatos confirmados.
- As fotografias são imagens reais de modelos Trixx publicadas por terceiros, mantidas como referências visuais. Não são fotos da WR; a permissão para redistribuí-las não foi verificada. As fontes estão em ASSET_CREDITS.md.
- Trocar as fotos por materiais autorizados pela WR e confirmar os modelos antes de usar comercialmente.

## Publicação

O GitHub Actions publica o conteúdo estático no GitHub Pages quando a branch main recebe alterações. A estrutura segue o princípio do VÉLO: HTML, CSS e JavaScript estáticos, sem etapa de build.
