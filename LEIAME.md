# Site Azul Marinho (azulmarinhoinfo.com.br)

Site 100% estático (HTML, CSS e JavaScript puro), publicado pelo **Cloudflare Pages**
(projeto `azulmarinho-site`). Cada alteração salva na branch `main` do GitHub vai
para o ar sozinha em cerca de 1 minuto.

## Páginas

| Endereço | O que é | Arquivo |
|---|---|---|
| `/` | Página principal: destaque rotativo (próximo evento, camisas da Sports, serviços) e os 3 caminhos | `index.html` |
| `/informatica/` | Cartela de serviços da Azul Marinho Informática e contatos | `informatica/index.html` |
| `/eventos/` | Próximo evento no topo e, abaixo, os que já aconteceram | `eventos/index.html` |
| `/eventos/evento.html?id=...` | Página de cada evento, com o tema (cores) do mês | `eventos/evento.html` |
| Azul Marinho Sports | Loja, em outro site | https://sports.azulmarinhoinfo.com.br |

## Arquivos que você edita

| Quer mudar... | Edite |
|---|---|
| Eventos | `eventos/eventos.js` (+ fotos em `eventos/fotos/`) |
| Serviços de informática | `assets/data/servicos.js` |
| WhatsApp, telefone, e-mail, Facebook | `assets/js/site.js` (bloco `window.AZUL`) |
| Camisas que aparecem na página principal | `assets/data/camisas.js` |
| Temas (cores) dos eventos | `assets/js/eventos-comum.js` (bloco `window.TEMAS`) |

---

## Como postar um evento novo (passo a passo)

### 1. Escolha um nome curto para o evento (o "id")
Sem espaço, sem acento, só letras minúsculas, números e hífen.
Exemplo: `natal-2026`. Ele vira o link: `azulmarinhoinfo.com.br/eventos/evento.html?id=natal-2026`.

### 2. Envie as fotos (pode fazer depois do evento)
1. No GitHub, abra o repositório **azulmarinho-site** e entre na pasta `eventos` → `fotos`.
2. Clique em **Add file → Upload files**.
3. Arraste as fotos. **Importante:** antes de soltar, renomeie no PC para `01.jpg`, `02.jpg`, `03.jpg`...
   e, no campo de nome do arquivo do GitHub, coloque a pasta na frente: `natal-2026/01.jpg`.
   (Mais fácil: no PC, crie uma pasta `natal-2026` com as fotos dentro e arraste a **pasta** inteira.)
4. Clique em **Commit changes**.

Dica: fotos de celular são grandes. Diminua para uns 1600 px de largura antes de enviar
(o site carrega mais rápido). O limite do Cloudflare é 25 MB por arquivo.

### 3. Cadastre o evento
1. Abra o arquivo `eventos/eventos.js` e clique no **lápis** (Edit).
2. Copie um bloco inteiro de evento, de `{` até `},`.
3. Cole logo abaixo da linha `window.EVENTOS = [`.
4. Troque os dados:

```js
    {
        id: "natal-2026",
        titulo: "Natal Azul Marinho",
        data: "2026-12-19",            // ANO-MÊS-DIA
        hora: "20:00",
        local: "Salão da Igreja",
        endereco: "Rua Exemplo, 123, Bairro, Ipatinga - MG",
        cidade: "Ipatinga",           // para a previsão do tempo
        tema: "natal",                 // veja a lista de temas abaixo
        descricao: "Primeiro parágrafo.\n\nSegundo parágrafo.",
        playlist: "https://open.spotify.com/playlist/...",
        fotos: [
            "fotos/natal-2026/01.jpg",
            "fotos/natal-2026/02.jpg"
        ],
        album: ""                      // opcional: link do Google Fotos com todas as fotos
    },
```

5. Clique em **Commit changes**. Em 1 minuto o evento está no ar.

> Atenção às vírgulas e aspas: cada campo termina com vírgula, e todo texto fica entre aspas `"..."`.
> Se a página de eventos ficar em branco, quase sempre é uma vírgula ou aspa faltando.

### Como o site organiza os eventos
- O evento com a data mais próxima (hoje ou depois) aparece como **Próximo evento**, no topo
  da página de eventos e no destaque rotativo da página principal.
- Os outros futuros aparecem em **Também vem aí**.
- Depois do dia do evento, ele passa sozinho para **Eventos que já aconteceram**,
  do mais recente para o mais antigo. Não precisa mudar nada.

### Previsão do tempo
- Vem do Open-Meteo (gratuito, sem cadastro), pela `cidade` do evento.
- Aparece a partir de **15 dias antes** do evento (antes disso, a página avisa a data).
- Depois do evento, mostra como foi o tempo naquele dia.
- Se a cidade tiver nome repetido, use `lat` e `lon` no lugar de `cidade`
  (pegue no Google Maps: botão direito no local → os dois números que aparecem).

### Mapa
O botão **Abrir no mapa** usa o `endereco`. Se quiser um ponto exato, abra o local no
Google Maps, clique em **Compartilhar → Copiar link** e coloque em `mapa: "https://maps.app.goo.gl/..."`.

### Playlist
Cole o link do Spotify (playlist, álbum ou música) ou de uma playlist do YouTube
(link com `list=`). Spotify e YouTube aparecem tocando direto na página.

### Lista de convidados e convites pelo WhatsApp (área privada)
A lista **não** aparece na página do evento. Ela fica na **Área do organizador**:
`azulmarinhoinfo.com.br/privado/` (tem um link discreto no fim de cada evento).

Os nomes ficam no arquivo `privado/convidados.js`:

```js
window.CONVIDADOS = {
    "natal-2026": [
        { nome: "Maria Souza", whats: "31999998888" },
        { nome: "João", whats: "31988887777" },
        "Tia Rosa"
    ]
};
```

Quem tem `whats` ganha o botão **Enviar convite**: ele abre o WhatsApp daquela pessoa
com o convite pronto (nome, data, hora, local e o link do evento). É só apertar enviar.
O botão fica "Enviado ✓" depois do clique (a marca fica guardada só no aparelho que você usou).

> ⚠️ **Antes de colocar nomes e telefones reais, faça os 2 passos abaixo.**
> Sem eles, qualquer pessoa que souber o endereço consegue ver a lista.

#### Passo 1: deixar o repositório do GitHub privado
Hoje o repositório `azulmarinho-site` é **público**: qualquer um pode ler os arquivos no GitHub.
1. Abra https://github.com/azulmarinhoinfo/azulmarinho-site → **Settings**.
2. Role até o fim (**Danger Zone**) → **Change repository visibility** → **Make private** → confirme.
O Cloudflare continua publicando normalmente.

#### Passo 2: colocar login na área privada (Cloudflare Access, gratuito)
1. No painel do Cloudflare, abra **Zero Trust** (menu da esquerda). Na primeira vez ele pede
   um nome para a equipe e o plano: escolha o **Free**.
2. Vá em **Access → Applications → Add an application → Self-hosted**.
3. Nome: `Area privada`. Em **Application domain** adicione 3 linhas:
   - `azulmarinhoinfo.com.br` com caminho `privado`
   - `azulmarinho-site.pages.dev` com caminho `privado`
   - `*.azulmarinho-site.pages.dev` com caminho `privado` (as prévias)
4. Em **Policies**: nome `So o Farley`, ação **Allow**, regra **Emails** = o seu e-mail.
5. Salve. Ao abrir `/privado/`, o Cloudflare pede seu e-mail e manda um código.
   Só o seu e-mail entra.

### Temas prontos

| tema | Para | | tema | Para |
|---|---|---|---|---|
| `padrao` | Azul Marinho | | `outubro-rosa` | Outubro Rosa |
| `verao` | Janeiro / verão | | `halloween` | Halloween |
| `carnaval` | Carnaval | | `natal` | Natal |
| `pascoa` | Páscoa | | `reveillon` | Ano-novo |
| `festa-junina` | Junho / julho | | `rock` | Show de rock |
| `dia-dos-pais` | Agosto | | `sertanejo` | Sertanejo |
| `primavera` | Setembro | | `neon` | Balada |
| `futebol` | Jogo, Copa | | `aniversario` | Aniversário |

Quer cores próprias? Use `cores` no evento (o tema vira só a base):

```js
        tema: "padrao",
        cores: { fundo1: "#1B1B3A", fundo2: "#693668", destaque: "#F7B32B", texto: "#EEE", titulo: "#FFF" },
        emoji: "🎤",
```

Só a página de cada evento muda de cor. A página principal e a lista de eventos
continuam sempre com as cores da Azul Marinho.

---

## Camisas da página principal
`assets/data/camisas.js` tem uma lista de camisas 2026/27 copiada do catálogo da
Azul Marinho Sports. A página sorteia algumas a cada visita. As fotos vêm direto do
site da Sports. Se uma camisa sair da loja, apague a linha dela aqui.
