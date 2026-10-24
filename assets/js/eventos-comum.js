/* =========================================================
   EVENTOS — temas do mês, ordem da lista, datas, mapa e clima.
   Os eventos em si ficam em /eventos/eventos.js.
   ========================================================= */

/* Temas prontos. No evento, use por exemplo:  tema: "halloween"
   claro: true = fundo claro (texto escuro). */
window.TEMAS = {
    "padrao":        { nome: "Azul Marinho",   emoji: "🎉", fundo: ["#08122E", "#24376B"], destaque: "#00ADEF", texto: "#DCE6F7", titulo: "#FFFFFF" },
    "verao":         { nome: "Verão",          emoji: "☀️", fundo: ["#FF7A00", "#FFC93C"], destaque: "#0077B6", texto: "#3B1F00", titulo: "#3B1F00", claro: true },
    "carnaval":      { nome: "Carnaval",       emoji: "🎭", fundo: ["#5B0F8C", "#C2185B"], destaque: "#FFD600", texto: "#FBE9FF", titulo: "#FFFFFF", padrao: "confete" },
    "pascoa":        { nome: "Páscoa",         emoji: "🐰", fundo: ["#FDE2E4", "#E2ECE9"], destaque: "#8E5B3C", texto: "#4A3426", titulo: "#4A3426", claro: true },
    "festa-junina":  { nome: "Festa Junina",   emoji: "🌽", fundo: ["#7A2E0E", "#C2410C"], destaque: "#FACC15", texto: "#FFF1DC", titulo: "#FFFFFF", padrao: "bandeirinhas" },
    "dia-dos-pais":  { nome: "Dia dos Pais",   emoji: "👔", fundo: ["#0B2545", "#13315C"], destaque: "#EEB902", texto: "#DDE6F2", titulo: "#FFFFFF" },
    "primavera":     { nome: "Primavera",      emoji: "🌸", fundo: ["#FCE7F3", "#DCFCE7"], destaque: "#DB2777", texto: "#3F2A37", titulo: "#831843", claro: true, padrao: "flores" },
    "outubro-rosa":  { nome: "Outubro Rosa",   emoji: "🎀", fundo: ["#831843", "#DB2777"], destaque: "#FBCFE8", texto: "#FDF2F8", titulo: "#FFFFFF" },
    "halloween":     { nome: "Halloween",      emoji: "🎃", fundo: ["#120821", "#3B1260"], destaque: "#FF7518", texto: "#EADCF8", titulo: "#FFFFFF", padrao: "estrelas" },
    "natal":         { nome: "Natal",          emoji: "🎄", fundo: ["#0B3D2E", "#14532D"], destaque: "#EF4444", texto: "#E7F5EC", titulo: "#FFFFFF", padrao: "neve" },
    "reveillon":     { nome: "Réveillon",      emoji: "🥂", fundo: ["#0A0A0A", "#1F1F1F"], destaque: "#D4AF37", texto: "#EDE6D3", titulo: "#FFFFFF", padrao: "estrelas" },
    "rock":          { nome: "Rock",           emoji: "🎸", fundo: ["#0D0D0D", "#3A0A0A"], destaque: "#E11D48", texto: "#E5E5E5", titulo: "#FFFFFF" },
    "sertanejo":     { nome: "Sertanejo",      emoji: "🤠", fundo: ["#3E2414", "#7C4A21"], destaque: "#F59E0B", texto: "#F7E8D5", titulo: "#FFFFFF" },
    "neon":          { nome: "Balada Neon",    emoji: "🪩", fundo: ["#07071F", "#1B0B3A"], destaque: "#FF2BD6", texto: "#D9E4FF", titulo: "#FFFFFF", padrao: "estrelas" },
    "futebol":       { nome: "Futebol",        emoji: "⚽", fundo: ["#0B4F2C", "#15803D"], destaque: "#FACC15", texto: "#E7F8EC", titulo: "#FFFFFF" },
    "aniversario":   { nome: "Aniversário",    emoji: "🎂", fundo: ["#1E3A8A", "#7C3AED"], destaque: "#FDE047", texto: "#EEF2FF", titulo: "#FFFFFF", padrao: "confete" },
    "dinossauro":    { nome: "Dinossauros",    emoji: "🦕", fundo: ["#2F2A1E", "#4D5B2E"], destaque: "#A3C76D", texto: "#EEF0DD", titulo: "#FFFFFF" },
    "copa":          { nome: "Seleção Brasileira", emoji: "🇧🇷", fundo: ["#00843D", "#0B5D2E"], destaque: "#FFDF00", texto: "#EAF7EE", titulo: "#FFFFFF", padrao: "confete" },
    "piscina":       { nome: "Pool Party",     emoji: "🏖️", fundo: ["#0EA5E9", "#22D3EE"], destaque: "#FF4F9A", texto: "#05324A", titulo: "#06283D", claro: true },
    "cruzeiro":      { nome: "Cruzeiro",       emoji: "🦊", fundo: ["#0B1F5C", "#1D3FA6"], destaque: "#FFFFFF", texto: "#DCE4FA", titulo: "#FFFFFF", padrao: "estrelas" },
    "super-heroi":   { nome: "Super-heróis",   emoji: "🕷️", fundo: ["#B91C1C", "#1E3A8A"], destaque: "#FACC15", texto: "#FEE2E2", titulo: "#FFFFFF" },
    "vingadores":    { nome: "Vingadores",     emoji: "🦸‍♂️", fundo: ["#132A6E", "#0B1A45"], destaque: "#E63027", texto: "#FFFFFF", titulo: "#F5B80F", padrao: "estrelas" },
    "dragon-ball":   { nome: "Dragon Ball",    emoji: "🐉", fundo: ["#C2410C", "#1E3A8A"], destaque: "#FDE047", texto: "#FFF4E6", titulo: "#FFFFFF", padrao: "estrelas" },
    "batizado":      { nome: "Batizado",       emoji: "🕊️", fundo: ["#FFFFFF", "#FCE7EF"], destaque: "#B8860B", texto: "#4B3B2A", titulo: "#6B4E16", claro: true, padrao: "flores" },
    "toy-story":     { nome: "Toy Story",      emoji: "🤠", fundo: ["#1D4ED8", "#60A5FA"], destaque: "#FACC15", texto: "#EFF6FF", titulo: "#FFFFFF" },
    "branca-de-neve": { nome: "Branca de Neve", emoji: "🍎", fundo: ["#1E3A8A", "#FDE68A"], destaque: "#DC2626", texto: "#F8FAFC", titulo: "#FFFFFF" },
    "jardim":        { nome: "Jardim",         emoji: "🌷", fundo: ["#FDF2F8", "#FBCFE8"], destaque: "#DB2777", texto: "#4A2537", titulo: "#9D174D", claro: true, padrao: "flores" },
    "polaroid":      { nome: "Álbum de memórias", emoji: "📸", fundo: ["#1F2937", "#4B5563"], destaque: "#F59E0B", texto: "#F3F4F6", titulo: "#FFFFFF" }
};

window.EV = (function () {
    var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    var DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

    function dataDe(ev) {
        var p = ev.data.split("-");
        return new Date(+p[0], +p[1] - 1, +p[2]);
    }

    function hoje() {
        var h = new Date();
        return new Date(h.getFullYear(), h.getMonth(), h.getDate());
    }

    function diasAte(ev) {
        return Math.round((dataDe(ev) - hoje()) / 86400000);
    }

    /* Próximos (do mais perto para o mais longe) e passados (do mais recente para o mais antigo).
       O evento continua como "próximo" até o fim do dia dele. */
    function separar() {
        var lista = (window.EVENTOS || []).filter(function (e) { return e && e.id && e.data; });
        var proximos = lista.filter(function (e) { return diasAte(e) >= 0; })
            .sort(function (a, b) { return dataDe(a) - dataDe(b); });
        var passados = lista.filter(function (e) { return diasAte(e) < 0; })
            .sort(function (a, b) { return dataDe(b) - dataDe(a); });
        return { proximos: proximos, passados: passados };
    }

    function buscar(id) {
        return (window.EVENTOS || []).filter(function (e) { return e.id === id; })[0] || null;
    }

    function dataCurta(ev) {
        var d = dataDe(ev);
        return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
    }

    function dataLonga(ev) {
        var d = dataDe(ev);
        return DIAS[d.getDay()] + ", " + d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear();
    }

    function diaMes(ev) {
        var d = dataDe(ev);
        return { dia: ("0" + d.getDate()).slice(-2), mes: MESES[d.getMonth()].slice(0, 3).toUpperCase() };
    }

    function contagem(ev) {
        var n = diasAte(ev);
        if (n < 0) return "Já aconteceu";
        if (n === 0) return "É hoje!";
        if (n === 1) return "É amanhã!";
        return "Faltam " + n + " dias";
    }

    function tema(ev) {
        var t = window.TEMAS[ev.tema] || window.TEMAS.padrao;
        var c = ev.cores || {};
        return {
            nome: t.nome,
            emoji: ev.emoji || t.emoji,
            fundo1: c.fundo1 || t.fundo[0],
            fundo2: c.fundo2 || t.fundo[1],
            destaque: c.destaque || t.destaque,
            texto: c.texto || t.texto,
            titulo: c.titulo || t.titulo,
            claro: c.claro != null ? c.claro : !!t.claro,
            padrao: ev.padrao || t.padrao || ""
        };
    }

    function linkMapa(ev) {
        if (ev.mapa) return ev.mapa;
        return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ev.endereco || ev.local || "");
    }

    function esc(s) {
        return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
        });
    }

    /* ---------- Clima (Open-Meteo, gratuito, sem cadastro) ---------- */

    var CODIGOS = {
        0: ["Céu limpo", "☀️"], 1: ["Poucas nuvens", "🌤️"], 2: ["Parcialmente nublado", "⛅"], 3: ["Nublado", "☁️"],
        45: ["Neblina", "🌫️"], 48: ["Neblina", "🌫️"],
        51: ["Garoa fraca", "🌦️"], 53: ["Garoa", "🌦️"], 55: ["Garoa forte", "🌧️"], 56: ["Garoa gelada", "🌧️"], 57: ["Garoa gelada", "🌧️"],
        61: ["Chuva fraca", "🌦️"], 63: ["Chuva", "🌧️"], 65: ["Chuva forte", "🌧️"], 66: ["Chuva gelada", "🌧️"], 67: ["Chuva gelada", "🌧️"],
        71: ["Neve fraca", "🌨️"], 73: ["Neve", "🌨️"], 75: ["Neve forte", "❄️"], 77: ["Neve", "🌨️"],
        80: ["Pancadas de chuva", "🌦️"], 81: ["Pancadas de chuva", "🌧️"], 82: ["Temporal", "⛈️"],
        85: ["Neve", "🌨️"], 86: ["Neve forte", "❄️"],
        95: ["Trovoadas", "⛈️"], 96: ["Trovoadas com granizo", "⛈️"], 99: ["Trovoadas com granizo", "⛈️"]
    };

    function coordenadas(ev) {
        if (ev.lat != null && ev.lon != null) return Promise.resolve({ lat: ev.lat, lon: ev.lon });
        var nome = ev.cidade || "Ipatinga";
        return fetch("https://geocoding-api.open-meteo.com/v1/search?count=1&language=pt&countryCode=BR&name=" + encodeURIComponent(nome))
            .then(function (r) { return r.json(); })
            .then(function (j) {
                if (!j.results || !j.results.length) throw new Error("cidade não encontrada");
                return { lat: j.results[0].latitude, lon: j.results[0].longitude };
            });
    }

    /* Resolve com { tipo: "longe", liberaEm } quando ainda não há previsão,
       ou { tipo: "previsao"|"registro", descricao, emoji, max, min, chuva, chuvaTipo, naHora } */
    function clima(ev) {
        var n = diasAte(ev);
        if (n > 15) {
            var libera = new Date(dataDe(ev).getTime() - 15 * 86400000);
            return Promise.resolve({ tipo: "longe", liberaEm: ("0" + libera.getDate()).slice(-2) + "/" + ("0" + (libera.getMonth() + 1)).slice(-2) });
        }
        return coordenadas(ev).then(function (c) {
            var passado = n < -3;
            var base = passado ? "https://archive-api.open-meteo.com/v1/archive" : "https://api.open-meteo.com/v1/forecast";
            var diario = passado
                ? "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum"
                : "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max";
            var url = base + "?latitude=" + c.lat + "&longitude=" + c.lon +
                "&start_date=" + ev.data + "&end_date=" + ev.data +
                "&daily=" + diario + "&hourly=temperature_2m,weather_code&timezone=America%2FSao_Paulo";
            return fetch(url).then(function (r) { return r.json(); }).then(function (j) {
                if (!j.daily || !j.daily.time || !j.daily.time.length) throw new Error("sem dados");
                var d = j.daily;
                var cod = CODIGOS[d.weather_code[0]] || ["Tempo variável", "🌡️"];
                var naHora = null;
                if (ev.hora && j.hourly) {
                    var h = parseInt(ev.hora, 10);
                    if (!isNaN(h) && j.hourly.temperature_2m[h] != null) {
                        var ch = CODIGOS[j.hourly.weather_code[h]] || cod;
                        naHora = { temp: Math.round(j.hourly.temperature_2m[h]), descricao: ch[0], emoji: ch[1] };
                    }
                }
                return {
                    tipo: passado || n < 0 ? "registro" : "previsao",
                    descricao: cod[0], emoji: cod[1],
                    max: Math.round(d.temperature_2m_max[0]), min: Math.round(d.temperature_2m_min[0]),
                    chuva: passado ? d.precipitation_sum[0] : d.precipitation_probability_max[0],
                    chuvaTipo: passado ? "mm" : "%",
                    naHora: naHora
                };
            });
        });
    }

    return {
        separar: separar, buscar: buscar, diasAte: diasAte, dataCurta: dataCurta, dataLonga: dataLonga,
        diaMes: diaMes, contagem: contagem, tema: tema, linkMapa: linkMapa, clima: clima, esc: esc
    };
})();
