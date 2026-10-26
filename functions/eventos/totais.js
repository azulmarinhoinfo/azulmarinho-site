/* =========================================================
   /eventos/totais?e=<evento> — só as QUANTIDADES de respostas do evento,
   para a página pública: { vai, nao, sem, total }.
   Nomes e dados dos convidados NUNCA saem daqui (ficam só no painel).
   Conta a resposta pelo link (resposta:<evento>:<código>) mesmo que o
   painel ainda não tenha sido aberto; depois que o painel aplicou a
   resposta (respEm), vale o que estiver marcado no painel.
   ========================================================= */

var ID_OK = /^[a-z0-9][a-z0-9-]{0,79}$/;

function json(dados, status, cache) {
    return new Response(JSON.stringify(dados), {
        status: status || 200,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache || "no-store" }
    });
}

async function lerJSON(kv, chave, padrao) {
    try { return JSON.parse((await kv.get(chave)) || "null") || padrao; } catch (e) { return padrao; }
}

export async function onRequestGet(context) {
    var env = context.env, e = new URL(context.request.url).searchParams.get("e");
    if (!env.DADOS) return json({ erro: "Indisponível no momento." }, 503);
    if (!ID_OK.test(e || "")) return json({ erro: "Evento inválido." }, 404);

    var eventos = await lerJSON(env.DADOS, "eventos", []);
    var ev = (Array.isArray(eventos) ? eventos : []).filter(function (x) { return x && x.id === e; })[0];
    if (!ev || ev.rascunho) return json({ erro: "Evento não encontrado." }, 404);

    var lista = ((await lerJSON(env.DADOS, "convidados", {}))[e] || []).filter(function (p) { return p && String(p.nome || "").trim(); });

    var respostas = {}, cursor;
    do {
        var l = await env.DADOS.list({ prefix: "resposta:" + e + ":", cursor: cursor });
        l.keys.forEach(function (k) { if (k.metadata) respostas[k.name.split(":")[2]] = k.metadata; });
        cursor = l.list_complete ? null : l.cursor;
    } while (cursor);

    var t = { vai: 0, nao: 0, sem: 0, total: lista.length };
    lista.forEach(function (p) {
        var r = p.c && respostas[p.c];
        var s = r && r.em && r.em !== p.respEm ? (r.r === "sim" ? "vai" : "nao")
            : p.confirmado ? "vai" : p.naoVai ? "nao" : "sem";
        t[s]++;
    });
    return json(t, 200, "public, max-age=30");
}
