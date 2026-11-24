# Site do Grupo LSC — contexto do projeto

## O que é
Site institucional do **Grupo LSC / Lusocabo** (lusocabo.com) — Telecomunicações (FTTH), Eletricidade Geral, Carregadores VE, Energias Renováveis e Construção Civil (inclui house flipping). Empresa: LUSOCABO — Tecnologias e Telecomunicações, Lda., NIF 515729493, Rua da Lameira 159, 4620-459 Ordem, Lousada. Desde 1999 (marca; a sociedade atual é de 2019 — usar sempre 1999 no site).

## Localização
- Pasta do projeto neste PC: `C:\LSC\Site_LSC` (já **não** usar a cópia antiga no OneDrive). `anuncios/` e `backup_site_antigo/` estão fora do git — só existem nesta pasta local.

## Arquitetura
- **Site estático** sem build: HTML + `assets/css/site.css` + `assets/js/site.js`. Sem jQuery/frameworks.
- **Trilingue PT/EN/FR**: todos os textos em `assets/js/i18n.js` (chaves `data-i18n`, `data-i18n-html`, `data-i18n-ph`, `data-i18n-content`). Ao adicionar texto novo, criar a chave **nos 3 blocos de idioma** — nunca deixar chaves em falta.
- **Deploy**: GitHub `pedromag97/LSC` (branch `main`) → Netlify (site "grupo-lsc") publica automaticamente a cada push no domínio lusocabo.com. Verificar o deploy com `curl` ao domínio após ~1 min.
- **Formulários** (3): contacto (index), orçamento carregadores (`carregadores.html`), orçamento solar (`renovaveis.html#orcamento`). Envio por Netlify Forms com fallback Formspree (`mojzkaop`); fotos são reduzidas no cliente antes do envio. Após envio com sucesso → redirect para `/obrigado.html` (página de conversão para anúncios).
- **Emails formatados**: função `netlify/functions/submission-created.js` (Resend) — tem whitelist `FORMS`; ao criar um formulário novo, adicioná-lo lá e adaptar o layout do email.
- **Pré-visualizar**: `python -m http.server 8317` (há config em `.claude/launch.json`, nome `lsc-site`).

## Anúncios (Google + Meta)
- UTMs registados em `sessionStorage` e enviados no campo oculto `Origem` de cada formulário.
- Em `site.js` há `var ADS = { googleTag, googleConvLabel, metaPixel }` — **IDs por preencher**. Com pelo menos um ID, aparece o banner de consentimento (RGPD) e os pixels só carregam após "Aceitar". Conversão = visita a `/obrigado.html` (evento Lead no Meta; conversão gtag se houver label).
- Landing pages das campanhas: carregadores → `/carregadores.html` · solar → `/renovaveis.html#orcamento`.
- Instagram: @grupo_lsc (já ligado no rodapé e no `sameAs`). Imagens dos anúncios em `anuncios/instagram/` (1:1, 4:5, 9:16; fotos reais + cores do site), geradas por `anuncios/gerar_imagens_instagram.py` (`python anuncios/gerar_imagens_instagram.py . anuncios/instagram`). A pasta `anuncios/` está no `.gitignore` — fica só local.

## Regras e cuidados
- **Codificação**: cuidado com scripts PowerShell gravados em ficheiro .ps1 e executados no PS 5.1 — texto acentuado fica duplamente codificado (já aconteceu; corrigido no commit fdf8d02). Preferir a ferramenta Edit para conteúdo com acentos.
- **Testemunhos**: só conteúdo real fornecido pelo dono. Não inventar avaliações.
- **Perfil "Lousacabo" (Google)**: por decisão do dono, o site **não** se associa a esse perfil nem à marca LOUSA — sem links, nomes, widgets ou avaliações ligados a ele. Links de mapa usam só coordenadas (41.2831297,-8.307354). Usar apenas a marca Lusocabo / Grupo LSC.
- **Imagens**: otimizar antes de adicionar (máx ~1600px, JPEG ~q72). Originais pesados ficam em `backup_site_antigo/` (fora do git, só local).
- **Ficheiros internos**: o Netlify publica a raiz do repositório, por isso qualquer ficheiro no git fica acessível em lusocabo.com. O `_redirects` força 404 (`404!`) para `CLAUDE.md`, `README.md`, `IDEIAS.png`, `prepros-6.config`, `/netlify/*` e `/.claude/*` (commit fb7425f). Ao adicionar ao git um ficheiro que não é do site (notas, rascunhos, configs), acrescentar uma regra lá e confirmar com `curl` que dá 404.
- Commits em português, mensagem imperativa curta.

## Pendentes
- [ ] Preencher IDs do Google Ads (`AW-…` + conversion label) e Meta Pixel em `site.js` quando o dono os enviar
- [ ] Mais testemunhos reais quando o dono os recolher (grelha em `index.html` § `#testemunhos`)
- [ ] (Se surgir) nº de alvará IMPIC para o rodapé
