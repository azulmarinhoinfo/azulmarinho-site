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
| Eventos e convidados | **Painel do organizador**: `azulmarinhoinfo.com.br/admin/` |
| Serviços de informática | `assets/data/servicos.js` |
| WhatsApp, telefone, e-mail, Facebook | `assets/js/site.js` (bloco `window.AZUL`) |
| Camisas que aparecem na página principal | `assets/data/camisas.js` |
| Temas (cores) dos eventos | `assets/js/eventos-comum.js` (bloco `window.TEMAS`) |

---

## Painel do organizador (`/admin/`)

O jeito fácil de cuidar dos eventos. Abra `azulmarinhoinfo.com.br/admin/` no PC ou no celular.
O painel pede a sua senha; só quem tem a senha entra.

No painel você:
- cria um evento (**Novo evento**), edita todos os detalhes ou duplica um evento antigo;
- escolhe o tema, ou cores próprias, e vê uma amostra de como fica;
- marca **Rascunho** para esconder o evento do site enquanto prepara;
- cadastra convidados (um por um, ou vários de uma vez colando a lista);
- reaproveita convidados de outros eventos: em **Escolher dos convidados já salvos**, busque
  pelo nome ou filtre "Quem foi em" um evento, marque e clique em **Adicionar marcados**
  (o WhatsApp vem junto);
- tira alguém de todos os eventos de uma vez: na mesma lista, clique na 🗑 ao lado do nome;
- clica em **Enviar convite**: abre o WhatsApp do convidado com o convite pronto,
  e o painel guarda que aquele convite já foi enviado.
- marca em cada convidado: **Convidado** (convite enviado), **Confirmado** (confirmou presença),
  **Adulto/Criança** (criança ganha o campo de idade) e **Masculino/Feminino**; clicar de novo desmarca.
  Embaixo da lista aparece a conta (convidados, confirmados, adultos, crianças, homens e mulheres).
  Ao escolher alguém dos convidados já salvos, adulto/criança, sexo e idade vêm junto.
- **confirmação pelo link**: cada convidado tem um link só dele no convite
  (`evento.html?id=...&c=<código>`). Na página do evento aparece "Vou / Não vou"; a resposta
  fica no KV (`resposta:<evento>:<código>`, via `functions/eventos/confirmar.js`) e, ao abrir o
  painel, o convidado já aparece como **Confirmado** ou **Não vai** ("📩 respondeu pelo link").
  Convites enviados antes desta função não têm o link pessoal: reenvie se quiser a confirmação.
- aba **Respostas** (em cada evento): totais de quem **vai**, **não vai** e **não respondeu**
  (com % e uma tabela por adultos, crianças, homens e mulheres) e as três listas com nomes,
  com filtro Homens/Mulheres e Adultos/Crianças. Só no painel.
- na **página pública do evento** aparecem só as **quantidades** (vão / não vão / não responderam),
  sem nenhum nome: vêm de `/eventos/totais?e=<evento>` (`functions/eventos/totais.js`), que conta
  também as respostas pelo link ainda não vistas no painel. Sem convidados, o quadro não aparece.

- aba **Tarefas** (em cada evento): cronograma com dia, hora de começar e de terminar.
  Todo evento já começa com as tarefas padrão (definir tema, convites, encomendas, compras,
  limpeza, montagem, churrasqueira...) em dias e horários sugeridos em relação à data da festa;
  no dia da festa, bolo, salgadinhos e churrasqueira acompanham o horário do evento.
  Marque a caixinha quando fizer; dá para mudar dia/horário, apagar e criar tarefas.
  Três jeitos de ver: **Lista** (por dia), **Andamento** (feitas, pendentes, atrasadas, por grupo)
  e **Calendário** (semana com os horários ocupados, ou mês). Se a data do evento mudar,
  o painel oferece mover as tarefas junto. **⭐ Usar esta lista como padrão** guarda a lista
  do evento como padrão dos próximos (chave `tarefasPadrao` no KV; o padrão sugerido fica
  em `TAREFAS_PADRAO` no `admin/index.html`). As tarefas ficam na chave `tarefas` do KV,
  nunca no site público.
- **tarefas ligadas** (`ligacoes()` no `admin/index.html`): a tarefa é reconhecida pelo nome e ganha
  um botão que abre um quadro com o que já existe no painel. "Definir tema" tem o campo do tema
  (aplica cores, emoji e fundo do tema pronto; apelidos em `APELIDOS_TEMA`); "Definir data, horário
  e local" e "Fazer novo convite" têm os campos do evento (preencher ali já muda o evento e o texto
  do convite); "Enviar o convite"/"grupo de WhatsApp" mostram o convite para copiar e o Enviar em
  sequência; "Lembrete" tem o texto e um botão por confirmado; "Confirmar presenças" tem
  **Pedir confirmação em sequência** (mensagem própria para quem recebeu o convite e não respondeu;
  marca `cobrado` com a data); tarefas de compra mostram as quantidades da aba Compras
  (supermercado do almoço, descartáveis, refri, suco, carne, gelo, carvão, bolo, salgados, cadeiras e mesas) em duas colunas: só confirmados e com quem não respondeu.
- aba **Compras** tem também **🍖 Churrasco** (carne crua 400/250/150 g e carvão 1 kg por kg de carne).
  E **🍬 Doces** (6/5/3 por pessoa, encomenda de 25 em 25) e **🎁 Lembrancinhas** (uma por pessoa + 10%, ou só crianças).
  Também ligadas: topo do bolo (texto com tema), crianças na piscina (lista com idade), TV e som (playlist),
  congelador (gelo e refri), churrasqueira (carne e carvão), devolver emprestados (fornecedores) e Pago nas tarefas de buscar/pagar.
- **tarefas em cada aba** (`TAREFAS_DA_ABA` / `faixaTarefasHTML`): no topo de Detalhes, Convidados, Respostas,
  Compras e Fornecedores aparece a faixa "📋 Tarefas ..." com as tarefas daquela parte; marcar ali conclui a tarefa
  na aba Tarefas (é a mesma tarefa). Em Convidados e Respostas cada tarefa abre o mesmo quadro da aba Tarefas
  (convite, lembrete, pedido de confirmação). Convidados tem também a faixa amarela **Pedir confirmação**.
- **itens desmarcados somem das tarefas** (`ITENS_DA_TAREFA` / `tarefasVisiveis`): desmarcar Bolo, Salgados, Doces,
  Lembrancinhas, Refri, Suco, Churrasco ou Almoço em "Vai ter na festa" (aba Compras) esconde as tarefas que dependem
  só desse item (em Tarefas, nas faixas das abas e no Copiar pendentes); marcando de novo elas voltam. As caixinhas agora
  ficam no KV junto das tarefas do evento (`tarefas[evento].tem`), valendo em todos os aparelhos.
  As compras são tarefas separadas (Comprar refri, Comprar suco, Comprar carne, Comprar gelo, Comprar descartáveis e
  "Compras supermercado (almoço)") para cada uma sumir com o seu item; a antiga "Comprar refri e carne" é dividida
  sozinha ao abrir o painel (`separarRefriCarne` / `SEPARAR_TAREFAS`); o mesmo vale para lembrancinhas, personalizados e topo do bolo, que viraram tarefas separadas. "Comprar gelo" só some com Refri e Suco desmarcados (e o gelo da aba Compras zera).
- aba **Fornecedores** (em cada evento): tipo, nome, WhatsApp, o que pediu, valor e pago, com total.
  Os fornecedores aparecem sozinhos nas tarefas do mesmo tipo (`TIPOS_FORNECEDOR`). Ficam na
  chave `fornecedores` do KV, nunca no site público.

Depois de mexer, clique em **Salvar alterações** (barra azul embaixo). O site atualiza em até 1 minuto.
Cada gravação guarda uma cópia da versão anterior por 90 dias (no KV, chaves `backup:...`).

Como funciona por dentro:
- `admin/index.html` é o painel; `functions/api/admin/dados.js` lê e grava os dados;
  `lib/acesso.js` confere o login (senha ou Cloudflare Access);
  `functions/api/admin/login.js` e `sair.js` entram e saem com a senha.
- Os dados ficam no **KV** do Cloudflare (ligado ao site com o nome `DADOS`).
- As páginas públicas leem os eventos de `/eventos/dados` (`functions/eventos/dados.js`),
  que nunca entrega convidados nem rascunhos. Enquanto o painel não salvar pela primeira vez,
  esse endereço usa o arquivo `eventos/eventos.js`.

### Configurar o painel no Cloudflare (uma vez só)

**1. Criar o armazenamento**
Em **Workers & Pages → KV** (ou **Storage & Databases → KV**) → **Create namespace**, nome `azulmarinho-dados`.

**2. Ligar o armazenamento e a senha ao site**
Em **Workers & Pages → azulmarinho-site → Settings**:
- **Bindings → Add → KV namespace**: nome da variável `DADOS`, namespace `azulmarinho-dados`.
- **Variables and Secrets → Add**: tipo **Secret**, nome `ADMIN_SENHA`, valor = a senha do painel
  (use uma senha forte, só sua). Para trocar a senha depois, é só editar aqui: todos os aparelhos saem.
- Faça isso em **Production** e em **Preview**.

**3. Publicar de novo**
Em **Deployments**, no último deploy, clique em **⋯ → Retry deployment** (ou salve qualquer
alteração no GitHub). Pronto: abra `/admin/`, digite a senha e clique em
**Salvar alterações** uma vez para levar os eventos atuais para o painel.

Segurança: depois de 8 senhas erradas, aquele endereço fica bloqueado por 15 minutos.
O login fica guardado no aparelho por 30 dias (botão **Sair do painel** encerra).

**Opcional: login por código no e-mail (Cloudflare Access)**
Em vez da senha, dá para usar o Cloudflare Access (o Cloudflare manda um código para o seu e-mail).
Exige ativar o **Zero Trust** (plano Free, mas pede cartão ou PayPal para validar). Depois:
crie um aplicativo **Self-hosted** protegendo `admin` e `api/admin` em `azulmarinhoinfo.com.br`,
`azulmarinho-site.pages.dev` e `*.azulmarinho-site.pages.dev`, com a regra **Emails** = o seu e-mail,
e adicione as variáveis `ACCESS_TEAM` (nome da equipe) e `ADMIN_EMAIL` (seu e-mail).
Com `ACCESS_TEAM` preenchido, o painel passa a usar o Access e ignora a senha.

---

## Como postar um evento pelo arquivo (sem o painel)

Só funciona enquanto o painel ainda não foi usado. Depois do primeiro **Salvar** no painel,
os eventos passam a vir de lá e o arquivo `eventos/eventos.js` fica só como reserva.


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

### Lista de convidados e convites pelo WhatsApp
Ficam no **Painel do organizador** (veja abaixo). A lista **não** aparece na página do
evento e **não** fica no GitHub: fica guardada no Cloudflare, só para você.

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

---

## App instalável (o site no celular, grátis)

O site inteiro pode ser instalado como app no celular (iPhone pelo Safari: Compartilhar →
**Adicionar à Tela de Início**; Android pelo Chrome: ⋮ → **Instalar app**). Abre em tela cheia
no portal, com o menu para Informática, Eventos, Piscina e Sports, e sempre mostra o site atual.

| Arquivo | O que faz |
|---|---|
| `manifest.webmanifest` | Nome, cores, ícones e atalhos do app |
| `assets/app/` | Ícones (feitos do símbolo do logo) |
| `sw.js` | Guarda cópias das páginas abertas para abrir sem internet. Sempre busca a versão nova primeiro; painel, `/api/`, convidados e pedidos nunca são guardados |
| `offline.html` | Aviso de "sem internet" para página nunca aberta |
| `assets/js/site.js` (final) | Liga o `sw.js` em todas as páginas |
| `functions/sports/[[path]].js` | Põe o app também nas páginas da loja vistas em `/sports/` |

Mudou o `sw.js`? Troque a `VERSAO` no topo dele para limpar as cópias antigas nos celulares.
