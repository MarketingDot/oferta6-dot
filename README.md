# Oferta Dia do Consumidor — DOT Energy

Página de oferta com a estrutura da `shop.ryzesuperfoods.com/fbo/ritual-set`,
adaptada para a identidade e a oferta da DOT.

**No ar:** https://oferta6-dot.vercel.app
**Repo:** https://github.com/MarketingDot/oferta6-dot

| Versão | Arquivo | Rota | O que é |
|---|---|---|---|
| **V2 (atual)** | `index.html` · `v2.css` · `v2.js` | `/` | Só as 4 telas da referência, na ordem da RYZE |
| V1 | `v1.html` · `styles.css` · `script.js` | `/v1.html` | Primeira versão, com prova social, marquee e faixa de sabores |

Push na `main` publica sozinho — o repo está conectado ao projeto na Vercel.

## Rodar localmente

```bash
python3 -m http.server 4321 --directory .
```

## V2 — as 4 telas, na ordem

1. **Header + barra de countdown** — faixa de aviso, nav com o logo, barra com
   HRS:MIN:SEG. Contagem de sessão em **três estados**, como na RYZE — detalhe
   na seção "Contador" abaixo.
2. **Bloco da oferta** — título, galeria com 5 miniaturas, avaliação, nome do
   kit, 50 doses, especificações, caixa de brindes, preço, countdown, CTA,
   garantias e os 3 bullets que fecham o bloco.
3. **Carrossel de brindes** — 3 cards. Carrossel no mobile, grid de 3 no desktop.
4. **Benefícios** — 4 itens + CTA (2×2 no mobile, 4 colunas no desktop).

Nada além disso: sem prova social, sem marquee, sem faixa de sabores.

## A oferta

| | |
|---|---|
| Produto | 2× Pouch de 25 sachês = **50 doses** |
| Sabores à escolha | Menta · Frutas vermelhas · Citrus · Melancia com limão |
| Brindes | Mousepad (R$ 35) · Bloco de notas (R$ 45) · Mini pouch melancia (R$ 25) |
| Por pouch | De R$ 162,49 por **R$ 149,95** |
| De | R$ 429,98 |
| Por | **R$ 299,90** — 30% OFF, economia de R$ 130,08 |
| Por dose | R$ 5,99 |

## Assets

Os 4 sabores foram **normalizados**: recortados no conteúdo real, escalados para
a mesma altura de pouch (1210px) e centralizados no mesmo canvas (900×1300).
Por isso saem exatamente do mesmo tamanho quando ficam lado a lado.

Duas pastas, de propósito:

| | |
|---|---|
| `assets/` | **WebP** redimensionado para o uso real. É o que vai para o ar. |
| `assets-src/` | Os **PNG** de origem, em alta. Commitados, mas excluídos do deploy pelo `.vercelignore`. |

Vários arquivos de `assets-src/` não existem em nenhum outro lugar — os
`sabor-*.png` normalizados, o `brinde-saches-melancia.png` montado a partir do
sachê isolado, o `icone-pouch.png` com o traço engrossado e o
`brindes-composicao-sem-titulo.png` com o xadrez recortado. Não apague.

A conversão levou os assets de **24MB para 1,1MB** (−95%), com a página inteira
fechando em **~720KB**. Cada imagem foi reduzida para 2× do maior tamanho em que
ela realmente aparece: `textura-navy` para 1400px, os pouches e brindes para
620px, a composição de brindes para 480px, o logo para 240px.

Para regerar depois de trocar algum PNG em `assets-src/`:

```python
im.save(f"assets/{nome}.webp", "WEBP", quality=82, method=6)
```

> As referências no HTML e no CSS apontam para `.webp`. Se você trocar uma
> imagem, mantenha a extensão ou atualize as referências junto.

A composição dos 3 brindes veio em **RGB com o xadrez de transparência pintado
nos pixels**. O fundo foi recortado com flood fill a partir das bordas — por ser
conectado, isso preserva o branco das folhas do caderno, que um recorte por cor
teria apagado junto. Depois foi reduzida para 620px (de 2,2MB para ~380KB).

A versão em uso é a **sem título**, porque o selo azul ao lado já diz
"BRINDES GRÁTIS" e a imagem original repetia. Para voltar à outra, troque o
`src` da caixa de brindes no `index.html`.

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
> grep -rn 'brinde-saches-melancia' index.html v1.html
> ```

## Pendências (a página está no ar com elas)

**1. Depoimentos.** ~~Número de avaliações~~ — resolvido: o card agora traz
**4,5 estrelas** (4 cheias + `#i-star-half`, meia estrela feita com gradiente de
50% sobre o mesmo path da estrela) e **"+30.000 Clientes Energizados"**, número
dado pelo Dotinho. Não há mais nenhum `data-placeholder` na página.

Falta ainda o bloco de depoimentos em si — a V2 não tem prova social, por
decisão de escopo (só as 4 telas da RYZE).

**2. Link do checkout.** `<a class="btn" href="#" id="checkoutBtn">` no card.

**3. ~~Prazo da oferta~~** — resolvido: virou contagem de sessão de 7 minutos com
prorrogação e estado final. Ver "Contador".

**4. ~~Seleção de sabor~~** — resolvido: existem os dois seletores. Ver
"Seletor de sabores".

## Bloco "Brindes grátis"

A caixa tracejada do card detalha a oferta item a item, sob um único título
azul. O primeiro pouch usa o `sabor-menta` (azul) e o segundo o `sabor-frutas`
(rosa), para os dois não saírem iguais:

| Item | De | Por |
|---|---|---|
| Pouch de 25 sachês | R$ 162,49 | R$ 149,95 |
| Pouch de 25 sachês | R$ 162,49 | R$ 149,95 |
| Mousepad DOT | R$ 35 | Grátis |
| Bloco de notas | R$ 45 | Grátis |
| Mini pouch melancia | R$ 25 | Grátis |

**A conta fecha com os dois preços da página** — e é por isso que esses números
não podem ser mexidos isoladamente:

```
2 × 162,49 + 105 (brindes) = 429,98   ← o "de" da oferta
2 × 149,95                 = 299,90   ← o "por" da oferta
```

Um fio tracejado (`.gift-list__sep`) separa o que é pago do que é brinde. O
preço com desconto usa `.now` em azul, não o amarelo do `.free`: sobre o creme
o destaque é sempre azul, e o amarelo fica reservado para o que não se paga.

## Contador

Três estados, na ordem em que o visitante os vê:

| Estado | Classe no `<body>` | O que aparece |
|---|---|---|
| Rodando | *(nenhuma)* | HRS:MIN:SEG contando 7 minutos |
| Expirado | `is-expired` | "Precisa de mais tempo? **Sim**" |
| Reservado | `is-reserved` | "Oferta reservada" |

Clicar em **Sim** devolve 5 minutos e volta ao estado "rodando". Quando esses
5 minutos zeram, cai em "Oferta reservada" — e daí não sai. A prorrogação é
**uma só**: o segundo clique é ignorado (`if (state.extended) return`).

Os dois tempos vêm do HTML, não do JS:

```html
<div class="salebar" id="salebar" data-minutes="7" data-extra-minutes="5">
```

O estado vive no **`sessionStorage`**, sob a chave `dot-oferta-timer`:

```js
{ deadline: 1788978276571, extended: false }
```

Sem essa persistência um F5 devolveria os 7 minutos e "Oferta reservada" nunca
significaria nada — o visitante recarregaria de volta para o começo. Como é
`sessionStorage` e não `localStorage`, **fechar a aba zera**: cada visita nova
começa com 7 minutos limpos. Se você quiser que o estado gruda entre visitas,
troque as duas chamadas em `v2.js` por `localStorage` — mas aí quem voltar dias
depois cai direto em "Oferta reservada".

O acesso está dentro de `try/catch` porque `sessionStorage` **lança exceção** em
aba anônima e com cookies bloqueados. Nesse caso a página continua funcionando,
só perde a memória entre recargas.

Para testar sem esperar os 7 minutos, force o estado pelo console:

```js
// cai em "Precisa de mais tempo?"
sessionStorage.setItem('dot-oferta-timer', JSON.stringify({deadline: Date.now()-1, extended: false}));
// cai em "Oferta reservada"
sessionStorage.setItem('dot-oferta-timer', JSON.stringify({deadline: Date.now()-1, extended: true}));
location.reload();
```

## Popup de sabores

Substituiu o seletor inline que existia dentro do card. Clicar em **Comprar
agora** abre um popup de **3 etapas**:

| # | Título | O que tem |
|---|---|---|
| 1 | Escolha seu 1º sabor | 4 pouches (`sabor-*.webp`) |
| 2 | Escolha seu 2º sabor | os mesmos 4 |
| 3 | Você ganhou os brindes! | os **3 brindes reais**, já marcados |

### Rodapé

O botão **Finalizar compra só aparece na etapa 3**. Nas etapas 1 e 2 o rodapé é
a barra "Você já desbloqueou…", com os 3 brindes reais e **uma miniatura de cada
vez**, revezando a cada 1,7s.

As 3 telas têm **a mesma altura**. Barra e botão ficam na **mesma célula** de
grade (`.modal__foot`), então o rodapé mede sempre o mais alto dos dois e o
popup não muda de tamanho ao trocar de etapa. Por isso a troca é por
`visibility` (classe `.is-off`) e **não** por `hidden`/`display: none` — um
`display: none` sairia do cálculo da célula e a altura voltaria a variar. O
`inert` acompanha, para o elemento invisível não receber foco.

O trilho usa `align-items: stretch` pelo mesmo motivo: sem isso o painel dos
brindes ficava 55px mais alto que os de sabor.

O timer do rodízio só roda com a barra à vista — para na etapa 3 e ao fechar o
popup. As 3 miniaturas lado a lado comiam 110px dos 345 do mobile e jogavam o
texto para 4 linhas; uma de cada vez fecha em 2.

> Como o botão sumiu das etapas 1 e 2, o único jeito de avançar nelas é escolher
> um sabor ou arrastar.

Escolher um sabor **avança sozinho** depois de 320ms — o atraso existe para o
selo amarelo aparecer antes da tela trocar. A seta volta, a barra de 3 traços
marca o progresso, e a seta some na etapa 1.

As etapas ficam **lado a lado num trilho** e trocar de etapa é um `translateX`
com transição de 380ms. Dá para **arrastar** entre elas — mouse ou dedo.

Na etapa 3 os brindes ficam com o **mini pouch em cima, centralizado**, e o
mousepad e o bloco embaixo (`.pick--wide` atravessa as duas colunas).

A etapa 3 mostra o que a pessoa realmente ganha — Mousepad (R$ 35), Bloco de
notas (R$ 45) e Mini pouch melancia (R$ 25), com as imagens `brinde-*.webp`.
São 3, não 4: o mockup trazia "Apoio de Teclado" e "Frete Grátis", que não estão
na oferta.

### Detalhes que precisam continuar existindo

O overlay é **na mão, não `<dialog>`** — o backdrop customizado do `<dialog>`
ainda varia demais entre navegadores.

**Abrir e fechar são animados** — o fundo esmaece e a folha sobe. Como não dá
para animar a partir de `display: none`, o `hidden` sai primeiro, um reflow força
o estado inicial e só então a classe `.is-open` entra. No fecho é o inverso: a
classe sai, e o `hidden` só volta no `transitionend` — com um timer de 340ms de
reserva, porque `transitionend` não dispara em aba de segundo plano nem com
movimento reduzido.

Quem tem `prefers-reduced-motion` não leva nem carrossel nem slide.

### O arraste

Gesto próprio com Pointer Events, **não o Swiper** que a página já carrega: aqui
o avanço depende de o sabor estar escolhido, e mandar no `allowSlideNext` dele
daria mais código que o gesto inteiro.

Três detalhes que precisam continuar existindo:

- **`touch-action: pan-y`** no trilho — sem isso o arraste horizontal briga com
  a rolagem vertical da folha.
- **Limiar de 8px e mais horizontal que vertical** antes de virar arraste, senão
  ele rouba a rolagem.
- **Clique cancelado** (`capture`) quando o gesto foi arraste, senão soltar em
  cima de um cartão escolheria aquele sabor sem querer.

Arrastar respeita o mesmo limite do botão: não passa de uma etapa que ainda não
foi respondida, e o gesto ganha resistência de 25% na ponta para avisar disso.

> **Os painéis usam `inert`, não `hidden`.** No trilho eles precisam continuar
> ocupando coluna; `inert` tira do `Tab` e do leitor de tela sem tirar do layout.

> **Os painéis têm `padding: 12px 14px 0`** e isso não é decoração: o selo de
> check fica 9px fora do cartão. Sem a folga, o selo do painel vizinho vaza para
> dentro da área visível e o da primeira linha é cortado pelo `overflow`.

Como o popup cobre a página, ele carrega também o que um overlay precisa ter:

- **`Escape` e clique no fundo fecham**, e o foco volta para quem o abriu.
- **Foco preso** no `Tab`: sem isso ele passeia pela página atrás do overlay.
- **`body { overflow: hidden }`** enquanto aberto, senão a página rola por baixo.

Os inputs são radios de verdade em `<fieldset>`, fora da tela via `clip-path` —
não `display: none`, senão perderiam o foco. O estado visual é a classe `.is-on`
e o anel de foco é `.has-focus`, ambos postos pelo JS para não depender de
`:has()`.

### Como a escolha chega no checkout

Igual ao seletor anterior — `data-pouch1`/`data-pouch2` no botão, e query string
quando `data-checkout` tiver a URL real:

```html
<a class="btn" id="checkoutBtn" data-checkout="https://loja.exemplo.com/kit">
```

```
https://loja.exemplo.com/kit?pouch1=menta&pouch2=melancia
```

> Enquanto não houver `data-checkout`, o botão **sempre** abre o popup. Quando a
> URL entrar, ele passa direto para o checkout se os dois sabores já estiverem
> escolhidos.

### Quem abre o popup

Os **dois** "Comprar agora" da página — o do card e o do fim da seção de
benefícios. Marque com `data-open-flavors`:

```html
<a class="btn" href="#" id="checkoutBtn" data-open-flavors>
<a class="btn" href="#oferta" data-open-flavors>
```

O atributo existe para não depender do `href`: o segundo botão é uma âncora
(`#oferta`) e ficava de fora quando o seletor era `a.btn[href="#"]`.

> O **Finalizar compra** da etapa 3 navega pela URL resolvida, e não por
> `checkoutBtn.click()`. Aquele botão agora abre o popup, então clicar nele de
> dentro do popup reabria tudo na etapa 1.

## Ícones

Todos são SVG inline, num sprite no topo do `index.html`. O raio (`#i-bolt`) é o
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

A exceção é `assets/icone-pouch.webp`, no bullet dos 4 sabores: é a ilustração da
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
