/* =========================================================
   /eventos/evento?id=... — a página do evento, já com a prévia
   do link (WhatsApp, Facebook, Telegram...) daquele evento.
   O WhatsApp não roda JavaScript: por isso o servidor escreve
   no HTML o título, a data/local e a foto de capa do evento.
   Os eventos vêm do KV "DADOS" (painel) ou, se o painel ainda
   não salvou nada, do arquivo eventos/eventos.js.
   Sem foto de capa, usa /assets/img/evento-padrao.png.
   ========================================================= */

var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
var DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
var IMAGEM_PADRAO = "/assets/img/evento-padrao.png";

async function lerEventos(env, request) {
    if (env.DADOS) {
        try {
            var texto = await env.DADOS.get("eventos");
            if (texto) {
                var lista = JSON.parse(texto);
                if (Array.isArray(lista)) return lista;
            }
        } catch (e) { /* usa o arquivo */ }
    }
    try {
        var r = await env.ASSETS.fetch(new URL("/eventos/eventos.js", request.url));
        return lerArquivo(await r.text());
    } catch (e) { return []; }
}

/* Lê os campos simples ("texto" entre aspas) de cada bloco { id: "..." } do eventos.js */
function lerArquivo(js) {
    var eventos = [];
    var blocos = js.split(/\n\s*\{\s*\n/);
    blocos.forEach(function (bloco) {
        var ev = {};
        ["id", "titulo", "data", "hora", "local", "cidade", "capa"].forEach(function (campo) {
            var m = bloco.match(new RegExp("(?:^|\\n)\\s*" + campo + "\\s*:\\s*(\"(?:[^\"\\\\]|\\\\.)*\")"));
            if (m) { try { ev[campo] = JSON.parse(m[1]); } catch (e) { /* ignora */ } }
        });
        if (/(?:^|\n)\s*rascunho\s*:\s*true/.test(bloco)) ev.rascunho = true;
        if (ev.id) eventos.push(ev);
    });
    return eventos;
}

function dataLonga(data) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data || "");
    if (!m) return "";
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return DIAS[d.getUTCDay()] + ", " + d.getUTCDate() + " de " + MESES[d.getUTCMonth()] + " de " + d.getUTCFullYear();
}

function descricao(ev) {
    var partes = [];
    var quando = dataLonga(ev.data);
    if (quando) partes.push("📅 " + quando.charAt(0).toUpperCase() + quando.slice(1) + (ev.hora ? ", às " + ev.hora : ""));
    var onde = ev.local || ev.cidade;
    if (onde) partes.push("📍 " + onde);
    return partes.join(" · ") || "Evento Azul Marinho";
}

/* "fotos/x/capa.png" → https://site/eventos/fotos/x/capa.png; links completos ficam como estão */
function imagem(capa, origem) {
    capa = String(capa || "").trim();
    if (!capa) return origem + IMAGEM_PADRAO;
    if (/^https?:\/\//i.test(capa)) return capa;
    if (capa.charAt(0) === "/") return origem + capa;
    return origem + "/eventos/" + capa.replace(/^\.\//, "");
}

function esc(texto) {
    return String(texto).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function trocar(valor) {
    return { element: function (el) { el.setAttribute("content", valor); } };
}

export async function onRequestGet(context) {
    var request = context.request, env = context.env;
    var url = new URL(request.url);
    var pagina = await env.ASSETS.fetch(new URL("/eventos/evento", url));

    var id = url.searchParams.get("id");
    if (!id || !pagina.ok || !(pagina.headers.get("Content-Type") || "").includes("text/html")) return pagina;

    var eventos = await lerEventos(env, request);
    var ev = eventos.find(function (e) { return e && e.id === id && !e.rascunho; });
    if (!ev) return pagina;

    var titulo = String(ev.titulo || "Evento").trim();
    var desc = descricao(ev);
    var img = imagem(ev.capa, url.origin);
    var endereco = url.origin + "/eventos/evento?id=" + encodeURIComponent(ev.id);
    var temCapa = !!String(ev.capa || "").trim();

    var resposta = new HTMLRewriter()
        .on("title", { element: function (el) { el.setInnerContent(titulo + " | Azul Marinho"); } })
        .on('meta[name="description"]', trocar(desc))
        .on('meta[property="og:title"]', trocar(titulo))
        .on('meta[property="og:description"]', trocar(desc))
        .on('meta[property="og:image"]', {
            element: function (el) {
                el.setAttribute("content", img);
                var extra = '<meta property="og:image:alt" content="' + esc(titulo) + '">';
                if (!temCapa) extra += '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">';
                el.after(extra, { html: true });
            }
        })
        .on('meta[property="og:url"]', trocar(endereco))
        .transform(pagina);

    var cab = new Headers(resposta.headers);
    cab.set("Cache-Control", "public, max-age=60");
    cab.delete("ETag");
    return new Response(resposta.body, { status: resposta.status, headers: cab });
}
