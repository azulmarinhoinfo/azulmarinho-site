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
   playlist   link da playlist do Apple Music, Spotify ou YouTube
   (a lista de convidados NÃO fica aqui: ela é privada e fica em
    privado/convidados.js, veja o LEIAME.md)
   fotos      lista de fotos do álbum: ["fotos/meu-evento/01.jpg", ...]
   album      opcional: link de um álbum completo (Google Fotos, Drive...)
   ========================================================= */

window.EVENTOS = [

    {
        id: "heitor-1-mes",
        titulo: "🦕🌿 Jurassic Heitor — 1 Mês",
        data: "2026-09-27",
        hora: "15:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "dinossauro",
        descricao: "Nosso pequeno Heitor acaba de completar 1 mês de vida! 👶🏻💙\n\nSerá um evento bem simples, só um bolinho mesmo para reunir os irmãos, pais, avós e padrinhos do Heitor. ❤️\n\nApenas a família mais próxima para comemorar esse primeiro mês do nosso pequeno explorador! 🥹💙",
        playlist: "https://music.apple.com/br/playlist/festa-infantil/pl.u-qxyllDXt2op40P3",
        fotos: [],
        album: ""
    },

    {
        id: "vai-brasa",
        titulo: "Vai Brasa",
        data: "2026-07-05",
        hora: "16:00 às 23:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "copa",
        descricao: "Dia de torcer pela Seleção Brasileira juntos! 🇧🇷💚💛",
        playlist: "",
        fotos: [],
        album: ""
    },

    {
        id: "henrique-4-anos",
        titulo: "Henrique 4 Anos",
        data: "2026-06-28",
        hora: "12:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "polaroid",
        descricao: "ALMOÇO AMERICANO\n\nDeixamos que o próprio Henrique escolhesse quem gostaria de ter por perto nesse dia tão especial.\nSe você está aqui, é porque ocupa um lugar importante no coração dele e também no nosso. Sua presença é o verdadeiro presente desta celebração.\n\nSerá uma alegria compartilhar esse momento com vocês.",
        playlist: "https://music.apple.com/br/playlist/festa-infantil/pl.u-qxyllDXt2op40P3",
        fotos: [],
        album: ""
    },

    {
        id: "florzinhas-no-jardim-de-deus",
        titulo: "Florzinhas no Jardim de Deus 🌷✨",
        data: "2026-01-18",
        hora: "13:00 às 23:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "jardim",
        descricao: "Aniversário de 5 anos da Helena e 1 aninho da Heloísa. 🌷✨",
        playlist: "https://music.apple.com/br/playlist/festa-infantil/pl.u-qxyllDXt2op40P3",
        fotos: [],
        album: ""
    },

    {
        id: "heloisa-11-meses",
        titulo: "Pool Party da Helô — 11 Meses",
        data: "2025-11-30",
        hora: "14:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "piscina",
        descricao: "Pool Party da Helô: 11 meses de sol, água e sorrisos! 💦☀️",
        playlist: "https://music.apple.com/us/playlist/pl.u-zPyLAeYFZVljkJe",
        fotos: [],
        album: ""
    },

    {
        id: "heloisa-10-meses",
        titulo: "Heloísa 10 Meses",
        data: "2025-10-18",
        hora: "18:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "cruzeiro",
        descricao: "Heloísa 10 meses na Toca da Raposa! 💙🦊",
        playlist: "https://music.apple.com/br/playlist/01-cruzeiro/pl.u-55D6X42i8AG7gj6",
        fotos: [],
        album: ""
    },

    {
        id: "henrique-3-anos",
        titulo: "Henrique 3 Anos e Heloísa 9 Meses",
        data: "2025-09-28",
        hora: "13:00 às 23:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "super-heroi",
        descricao: "Henrique 3 anos e Heloísa 9 meses com o Spidey e seus Amigos Espetaculares! 🕷️",
        playlist: "https://music.apple.com/br/playlist/festa-infantil/pl.u-qxyllDXt2op40P3",
        fotos: [],
        album: ""
    },

    {
        id: "heloisa-8-meses",
        titulo: "Arraiá da Helô — 8 Meses",
        data: "2025-08-30",
        hora: "18:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "festa-junina",
        descricao: "Arraiá da Helô: 8 meses com bandeirinhas, fogueira e muita alegria! 🌽🎉",
        playlist: "https://music.apple.com/br/playlist/arraia-da-hel%C3%B4/pl.u-zPyLAdvTZVljkJe",
        fotos: [],
        album: ""
    },

    {
        id: "heloisa-7-meses",
        titulo: "Heloísa 7 Meses",
        data: "2025-07-27",
        hora: "15:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "dragon-ball",
        descricao: "Tema: 🐉 Heloísa: Uma Nova Lenda Sayajin!\n\n🚨🚨 Importante 🚨🚨\nConvidado não convida 😉",
        playlist: "https://music.apple.com/br/playlist/festa-infantil/pl.u-qxyllDXt2op40P3",
        fotos: [],
        album: ""
    },

    {
        id: "heloisa-6-meses-batizado",
        titulo: "Batismo Heloísa Teresa — 6 Meses",
        data: "2025-06-22",
        hora: "09:00",
        local: "Comunidade Nossa Senhora de Fátima",
        endereco: "Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "batizado",
        descricao: "Batismo da Heloísa Teresa, aos 6 meses. 🕊️",
        playlist: "https://music.apple.com/br/playlist/festa-infantil/pl.u-qxyllDXt2op40P3",
        fotos: [],
        album: ""
    },

    {
        id: "heloisa-5-meses",
        titulo: "Heloísa 5 Meses",
        data: "2025-05-18",
        hora: "15:00 às 21:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "toy-story",
        descricao: "Tema: Toy Story 🤠\n\n🚨🚨 Importante 🚨🚨\nConvidado não convida 😉",
        playlist: "https://music.apple.com/br/playlist/festa-infantil/pl.u-qxyllDXt2op40P3",
        fotos: [],
        album: ""
    },

    {
        id: "heloisa-4-meses",
        titulo: "Heloísa 4 Meses",
        data: "2025-04-13",
        hora: "13:00 às 19:00",
        local: "Chácara Feliz",
        endereco: "Rua Jacarandá, 111, Santana do Paraíso - MG",
        cidade: "Santana do Paraíso", lat: -19.363, lon: -42.569,
        tema: "branca-de-neve",
        descricao: "Tema: Branca de Neve 🍎\n\n🚨🚨 Importante 🚨🚨\nConvidado não convida 😉",
        playlist: "https://music.apple.com/br/playlist/festa-infantil/pl.u-qxyllDXt2op40P3",
        fotos: [],
        album: ""
    }

];
