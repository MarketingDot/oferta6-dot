# Oferta Dia do Consumidor — DOT Energy

Página de oferta com a estrutura da `shop.ryzesuperfoods.com/fbo/ritual-set`,
adaptada para a identidade e a oferta da DOT.

| Versão | Arquivo | URL local | O que é |
|---|---|---|---|
| **V2 (atual)** | `v2.html` · `v2.css` · `v2.js` | `/v2.html` | Só as 4 telas da referência, na ordem da RYZE |
| V1 | `index.html` · `styles.css` · `script.js` | `/` | Primeira versão, com prova social, marquee e faixa de sabores |

## Rodar localmente

```bash
python3 -m http.server 4321 --directory .
```

## V2 — as 4 telas, na ordem

1. **Header + barra de countdown** — faixa de aviso, nav com o logo, barra com
   DIA:HRS:MIN:SEG. Quando zera, troca para "Precisa de mais tempo? **Sim**" e o
   botão devolve 15 minutos (o mesmo recurso da RYZE).
2. **Bloco da oferta** — título, galeria com 5 miniaturas, avaliação, nome do
   kit, 50 doses, especificações, caixa de brindes, preço, countdown, CTA,
   garantias e os 3 bullets que fecham o bloco.
3. **Carrossel de brindes** — 3 cards. Carrossel no mobile, grid de 3 no desktop.
4. **Benefícios** — 6 itens + CTA.

Nada além disso: sem prova social, sem marquee, sem faixa de sabores.

## A oferta

| | |
|---|---|
| Produto | 2× Pouch de 25 sachês = **50 doses** |
| Sabores à escolha | Menta · Frutas vermelhas · Citrus · Melancia com limão |
| Brindes | Mousepad (R$ 35) · Bloco de notas (R$ 45) · Mini pouch melancia (R$ 25) |
| De | R$ 429,98 |
| Por | **R$ 299,90** — 30% OFF, economia de R$ 130,08 |
| Por dose | R$ 5,99 |

## Assets

Os 4 sabores foram **normalizados**: recortados no conteúdo real, escalados para
a mesma altura de pouch (1210px) e centralizados no mesmo canvas (900×1300).
Por isso saem exatamente do mesmo tamanho quando ficam lado a lado.

```
assets/sabor-menta.png      assets/sabor-frutas.png
assets/sabor-citrus.png     assets/sabor-melancia.png
assets/brinde-mousepad.png  assets/brinde-bloco.png
assets/brinde-saches-melancia.png
assets/brindes-composicao-sem-titulo.png   ← em uso na caixa de brindes do card
assets/brindes-composicao.png              ← mesma imagem, com o título "BRINDES GRÁTIS"
```

A composição dos 3 brindes veio em **RGB com o xadrez de transparência pintado
nos pixels**. O fundo foi recortado com flood fill a partir das bordas — por ser
conectado, isso preserva o branco das folhas do caderno, que um recorte por cor
teria apagado junto. Depois foi reduzida para 620px (de 2,2MB para ~380KB).

A versão em uso é a **sem título**, porque o selo azul ao lado já diz
"BRINDES GRÁTIS" e a imagem original repetia. Para voltar à outra, troque o
`src` na linha 201 do `v2.html`.

`assets-v2-preview.png` na raiz é uma folha de conferência dessas imagens.

> **`brinde-saches-melancia.png`** foi **montado por mim** a partir do sachê
> isolado do brand folder (9 cópias em lattice diagonal), porque a foto original
> dos 9 pacotinhos não estava no disco.
>
> Se for trocar pelo arquivo real, **use um nome novo** e ajuste as referências
> no HTML em vez de sobrescrever. Sobrescrever mantendo o nome faz o navegador
> continuar servindo a imagem antiga do cache — foi exatamente o que aconteceu
> aqui, e leva um tempo até você desconfiar que o problema é cache e não o build.
>
> ```bash
> grep -rn 'brinde-saches-melancia' v2.html index.html
> ```

## Pendências antes de publicar

**1. Depoimentos / número de avaliações.** A V2 tem só 1 marcação laranja
(`[N] avaliações` no card). Não inventei número:

```bash
grep -n 'data-placeholder' v2.html
```

**2. Link do checkout.** `<a class="btn" href="#" id="checkoutBtn">` no card.

**3. Prazo da oferta.** O contador zera às 23:59:59 de hoje. Para data fixa:

```html
<div class="salebar" id="salebar" data-deadline="2026-03-15T23:59:59-03:00">
```

**4. Seleção de sabor.** Ainda não existe seletor — a copy diz que os sabores são
escolhidos na etapa seguinte. Quando quiser, dá pra montar dois seletores
(Pouch 1 / Pouch 2) usando os ícones de sabor.

## Ícones

Todos são SVG inline, num sprite no topo do `v2.html`. O raio (`#i-bolt`) é o
**`fi-br-bolt` do Flaticon UIcons**, extraído do glifo U+F1F9 da fonte
`uicons-bold-rounded` e convertido em path — mesmo desenho, sem carregar a fonte.
Conferido contra o original: **97% de sobreposição de pixel** (o resto é
diferença de rasterização).

Se preferir usar a fonte de ícones direto, é trocar o sprite por:

```html
<link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css">
<i class="fi fi-br-bolt"></i>
```

Custa **147KB de CSS + 215KB de fonte** para um ícone só, por isso não fiz assim.
Vale a pena se você for usar vários UIcons na página.

> O plano gratuito do Flaticon exige atribuição. Se a DOT tem assinatura paga,
> não tem o que fazer; se não tem, vale confirmar antes de publicar.

A exceção é `assets/icone-pouch.png`, no bullet dos 4 sabores: é a ilustração da
embalagem, não um ícone do sprite. O desenho original tinha traço de 20px numa
arte de 1117px de altura — a 36px isso vira 0,6px e some. O traço foi engrossado
por dilatação da máscara **antes** de reduzir e recolorido para `#0f2d72`, o mesmo
azul do raio e do presente.

Resultado: **2,7px de traço** quando o ícone tem 36px — exatamente o peso do ícone
de presente (`stroke-width: 1.8` num viewBox de 24 → 1.8 ÷ 24 × 36 = 2,7px).
Para refazer com outro peso, é só mudar o raio:

```python
AZUL = (15, 45, 114)
mask.filter(ImageFilter.MaxFilter(65))   # raio 32 → 2,7px
# traço final em px = (20 + 2*raio) / 1117 * 36
```

## Carrosséis

**Galeria** — arrastar, setas ‹ ›, clicar nas miniaturas ou setas do teclado.
**Brindes** (só abaixo de 992px) — arrastar ou clicar nos pontinhos.

Detalhe que quebrava tudo no desktop: o navegador dispara o *arraste nativo de
imagem* quando você pressiona e puxa o mouse em cima de um `<img>`, e isso engole
o swipe. A correção está em três lugares e precisa continuar existindo:

```css
.swiper, .swiper img { -webkit-user-drag: none; user-select: none; }
.swiper img { pointer-events: none; }   /* o gesto sempre cai no slide */
```

```js
img.draggable = false;
img.addEventListener('dragstart', e => e.preventDefault());
```

Os pontinhos têm 8px visíveis mas **28×28 de área de toque** — com 8px era quase
impossível acertar no celular.

## Comportamento

**Breakpoint único: 992px.**

Abaixo: coluna única, galeria em cima do card, brindes em carrossel de 1,6 cards
centrado sangrando até a borda da tela.

Acima: bloco de oferta em 2 colunas (galeria 627px em `position: sticky` /
card 589px — as mesmas medidas da RYZE), brindes em grid de 3, benefícios em 3
colunas.

## Paleta

```
#04142f  navy    — texto e fundos escuros
#0f2d72  azul    — eyebrows, preço, ícones e destaques sobre fundo claro
#fceb2e  amarelo — CTA e etiquetas
#fefbe6  cream   — fundo geral
#797777  cinza   — preços riscados
```

Regra: **amarelo só sobre navy**. Sobre o cream o destaque é sempre azul.
