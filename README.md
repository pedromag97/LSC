# Site do Grupo LSC

Site institucional do **Grupo LSC / Lusocabo** — Telecomunicações (FTTH), Eletricidade Geral, Energias Renováveis e Construção Civil. Em operação desde 2000, com presença em Portugal, Espanha, França e Itália.

## Estrutura

| Ficheiro | Descrição |
|---|---|
| `index.html` | Página principal (sobre, áreas, projetos, presença, clientes, recrutamento, contacto) |
| `telecom.html` | Telecomunicações — redes FTTH |
| `elec.html` | Eletricidade Geral — instalações e carregadores VE |
| `renovaveis.html` | Energias Renováveis — centrais fotovoltaicas |
| `civil.html` | Construção Civil |
| `assets/css/site.css` | Folha de estilos única |
| `assets/js/site.js` | Funcionalidades (menu, galerias, lightbox, contadores, formulário) |
| `assets/js/i18n.js` | **Todos os textos do site em PT / EN / FR** — editar aqui |

## Como editar textos

Os textos das três línguas estão centralizados em `assets/js/i18n.js`. Cada chave (ex.: `"hero.title"`) existe nas secções `pt`, `en` e `fr`.

## Formulário de contacto

O formulário usa o [Formspree](https://formspree.io). Para ativar, criar uma conta gratuita, criar um formulário e substituir `SEU_ID_FORMSPREE` no `index.html` pelo ID gerado.

## Desenvolvimento local

Não há build — é um site estático. Para pré-visualizar localmente:

```
python -m http.server 8317
```

e abrir `http://localhost:8317`.
