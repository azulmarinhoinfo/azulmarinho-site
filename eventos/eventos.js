/* =========================================================
   LISTA DE EVENTOS DA AZUL MARINHO — edite aqui
   ---------------------------------------------------------
   Para postar um evento novo, copie um bloco { ... } inteiro,
   cole logo abaixo de "window.EVENTOS = [" e troque os dados.
   A ordem aqui não importa: o site coloca sozinho o próximo
   evento no topo e os que já aconteceram logo abaixo.
   Passo a passo completo: LEIAME-EVENTOS.md

   Campos:
   id         nome curto, sem espaço nem acento (vira o link do evento)
   titulo     nome do evento
   data       "ANO-MÊS-DIA", ex.: "2026-11-28"
   hora       "20:00"
   local      nome do lugar
   endereco   endereço completo (usado no botão "Abrir no mapa")
   mapa       opcional: link do Google Maps, se quiser um link exato
   cidade     cidade para a previsão do tempo (ou use lat e lon)
   tema       um dos temas prontos: padrao, verao, carnaval, pascoa,
              festa-junina, dia-dos-pais, primavera, outubro-rosa,
              halloween, natal, reveillon, rock, sertanejo, neon,
              futebol, aniversario
   cores      opcional, para criar cores próprias:
              { fundo1: "#...", fundo2: "#...", destaque: "#...", texto: "#...", titulo: "#...", claro: false }
   emoji      opcional, troca o emoji do tema
   capa       opcional: foto de capa, ex.: "fotos/meu-evento/capa.jpg"
   descricao  texto do evento (pode ter várias linhas, use \n\n para novo parágrafo)
   playlist   link da playlist do Spotify ou do YouTube
   (a lista de convidados NÃO fica aqui: ela é privada e fica em
    privado/convidados.js, veja o LEIAME.md)
   fotos      lista de fotos do álbum: ["fotos/meu-evento/01.jpg", ...]
   album      opcional: link de um álbum completo (Google Fotos, Drive...)
   ========================================================= */

window.EVENTOS = [

    {
        id: "halloween-2026",
        titulo: "Noite de Halloween Azul Marinho",
        data: "2026-10-31",
        hora: "20:00",
        local: "Local de exemplo",
        endereco: "Parque Ipanema, Ipatinga - MG",
        cidade: "Ipatinga",
        tema: "halloween",
        descricao: "EVENTO DE EXEMPLO: troque este texto pela descrição do seu evento.\n\nVenha fantasiado! Vai ter música, comidinhas temáticas e concurso de melhor fantasia.",
        playlist: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
        fotos: [],
        album: ""
    },

    {
        id: "primavera-2026",
        titulo: "Festival da Primavera",
        data: "2026-09-26",
        hora: "16:00",
        local: "Local de exemplo",
        endereco: "Parque Ipanema, Ipatinga - MG",
        cidade: "Ipatinga",
        tema: "primavera",
        descricao: "EVENTO DE EXEMPLO: troque este texto pela descrição do seu evento.\n\nUma tarde ao ar livre para receber a primavera, com piquenique, música e muitas flores.",
        playlist: "",
        fotos: [
            "fotos/primavera-2026/01.svg",
            "fotos/primavera-2026/02.svg",
            "fotos/primavera-2026/03.svg",
            "fotos/primavera-2026/04.svg",
            "fotos/primavera-2026/05.svg",
            "fotos/primavera-2026/06.svg"
        ],
        album: ""
    },

    {
        id: "arraia-2026",
        titulo: "Arraiá Azul Marinho",
        data: "2026-07-18",
        hora: "18:00",
        local: "Local de exemplo",
        endereco: "Centro, Ipatinga - MG",
        cidade: "Ipatinga",
        tema: "festa-junina",
        descricao: "EVENTO DE EXEMPLO: troque este texto pela descrição do seu evento.\n\nQuadrilha, fogueira, canjica e quentão.",
        playlist: "",
        fotos: [],
        album: ""
    }

];
