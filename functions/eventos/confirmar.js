/* =========================================================
   /eventos/confirmar — o convidado confirma presença pelo link do convite.
   Cada convidado tem um código só dele (campo "c" na lista do painel);
   o convite leva /eventos/evento?id=<evento>&c=<código>.
     GET  ?e=<evento>&c=<código>
          → { nome, resposta, pessoas: [ { c, nome, rel, resposta, por } ] }
            "pessoas" = quem abriu o link (rel "você") + a família vinculada a ele no painel:
            esposo(a)/parceiro(a) e os filhos/crianças dele ou do parceiro(a).
     POST { e, c, resposta: "sim"|"nao" }                      → responde só por quem abriu
     POST { e, c, respostas: { <código>: "sim"|"nao", ... } }   → responde por si e pela família
          → devolve o mesmo que o GET, já atualizado
   A resposta fica no KV "DADOS" numa chave separada para cada pessoa
   (resposta:<evento>:<código>), para não brigar com o que o painel salva.
   Quando alguém responde por outra pessoa da família, a chave guarda quem respondeu (por).
   O painel lê essas chaves e marca Confirmado / Não vai sozinho.
   ========================================================= */

var ID_OK = /^[a-z0-9][a-z0-9-]{0,79}$/;
var COD_OK = /^[a-z0-9]{8,20}$/;

function json(dados, status) {
    return new Response(JSON.stringify(dados), {
        status: status || 200,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
    });
}

function primeiro(p) { return String((p && p.nome) || "").trim().split(/\s+/)[0]; }

/* Família de p na lista do evento (a mesma regra do painel, admin/index.html → familiaDe) */
function familia(lista, p) {
    function porC(c) { return c ? lista.filter(function (x) { return x && x.c === c; })[0] : null; }
    var fora = {}, saida = [];
    fora[p.c] = true;
    function add(x, rel) { if (!x || !x.c || fora[x.c] || !String(x.nome || "").trim()) return; fora[x.c] = true; saida.push({ p: x, rel: rel }); }
    var parc = porC(p.parc) || lista.filter(function (x) { return x && x.c && x.parc === p.c; })[0];
    if (parc) add(parc, parc.sexo === "f" ? "esposa" : parc.sexo === "m" ? "esposo" : "parceiro(a)");
    var pais = {};
    pais[p.c] = true;
    if (parc) pais[parc.c] = true;
    lista.forEach(function (x) {
        if (!x || !Array.isArray(x.resp)) return;
        var r = x.resp.filter(function (v) { return v && pais[v.c]; });
        if (!r.length) return;
        var filho = r.some(function (v) { return v.t === "pai" || v.t === "mae"; });
        add(x, !filho ? "criança" : x.sexo === "f" ? "filha" : x.sexo === "m" ? "filho" : "filho(a)");
    });
    return saida;
}

async function achar(env, e, c) {
    if (!env.DADOS) return { erro: json({ erro: "Indisponível no momento." }, 503) };
    if (!ID_OK.test(e || "") || !COD_OK.test(c || "")) return { erro: json({ erro: "Link inválido." }, 404) };
    var conv = {};
    try { conv = JSON.parse((await env.DADOS.get("convidados")) || "{}"); } catch (x) { conv = {}; }
    var lista = (conv[e] || []).filter(function (x) { return x && typeof x === "object"; });
    var p = lista.filter(function (x) { return x.c === c; })[0];
    if (!p) return { erro: json({ erro: "Convite não encontrado." }, 404) };
    return { p: p, lista: lista, pessoas: [{ p: p, rel: "você" }].concat(familia(lista, p)) };
}

/* Resposta de uma pessoa: a do link (se o painel ainda não aplicou) ou o que está marcado no painel */
function situacao(x, meta, lista) {
    var r = "", por = "";
    if (meta && meta.em && meta.em !== x.respEm) { r = meta.r; por = meta.por || x.c; }
    else {
        r = x.confirmado ? "sim" : x.naoVai ? "nao" : "";
        if (r && meta && meta.r === r) por = meta.por || x.c;
    }
    var quem = por && lista.filter(function (y) { return y.c === por; })[0];
    return { resposta: r || "", por: quem ? primeiro(quem) : "", porC: por };
}

async function montar(env, e, a, gravadas) {
    var pessoas = [];
    for (var i = 0; i < a.pessoas.length; i++) {
        var x = a.pessoas[i].p;
        var s = gravadas && gravadas[x.c];
        if (!s) {
            var r = await env.DADOS.getWithMetadata("resposta:" + e + ":" + x.c);
            s = situacao(x, r && r.metadata, a.lista);
        }
        pessoas.push({ c: x.c, nome: primeiro(x), rel: a.pessoas[i].rel, resposta: s.resposta,
            por: s.porC && s.porC !== a.p.c ? s.por : "" });
    }
    return { nome: primeiro(a.p), resposta: pessoas[0].resposta, pessoas: pessoas };
}

export async function onRequestGet(context) {
    var u = new URL(context.request.url), e = u.searchParams.get("e");
    var a = await achar(context.env, e, u.searchParams.get("c"));
    if (a.erro) return a.erro;
    return json(await montar(context.env, e, a));
}

export async function onRequestPost(context) {
    var corpo;
    try { corpo = await context.request.json(); } catch (x) { return json({ erro: "Dados inválidos." }, 400); }
    if (!corpo || typeof corpo !== "object") return json({ erro: "Dados inválidos." }, 400);
    var pedidas = {};
    if (corpo.respostas && typeof corpo.respostas === "object") pedidas = corpo.respostas;
    else pedidas[corpo.c] = corpo.resposta;
    var codigos = Object.keys(pedidas);
    if (!codigos.length || codigos.length > 30) return json({ erro: "Resposta inválida." }, 400);
    for (var k = 0; k < codigos.length; k++) {
        if (pedidas[codigos[k]] !== "sim" && pedidas[codigos[k]] !== "nao") return json({ erro: "Resposta inválida." }, 400);
    }
    var a = await achar(context.env, corpo.e, corpo.c);
    if (a.erro) return a.erro;
    var pode = {};
    a.pessoas.forEach(function (x) { pode[x.p.c] = true; });
    if (codigos.some(function (c) { return !pode[c]; })) return json({ erro: "Essa pessoa não está neste convite." }, 403);

    var em = new Date().toISOString(), gravadas = {};
    for (var i = 0; i < codigos.length; i++) {
        var c = codigos[i], meta = { r: pedidas[c], em: em };
        if (c !== corpo.c) meta.por = corpo.c;   // respondeu por alguém da família
        await context.env.DADOS.put("resposta:" + corpo.e + ":" + c, "", { metadata: meta });
        gravadas[c] = { resposta: meta.r, porC: meta.por || c, por: primeiro(a.p) };
    }
    var d = await montar(context.env, corpo.e, a, gravadas);
    d.ok = true;
    return json(d);
}
