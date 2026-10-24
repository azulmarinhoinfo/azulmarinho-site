/* =========================================================
   /eventos/confirmar — o convidado confirma presença pelo link do convite.
   Cada convidado tem um código só dele (campo "c" na lista do painel);
   o convite leva /eventos/evento?id=<evento>&c=<código>.
     GET  ?e=<evento>&c=<código>        → { nome, resposta }
     POST { e, c, resposta: "sim"|"nao" } → grava a resposta
   A resposta fica no KV "DADOS" numa chave separada
   (resposta:<evento>:<código>), para não brigar com o que o painel salva.
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

async function achar(env, e, c) {
    if (!env.DADOS) return { erro: json({ erro: "Indisponível no momento." }, 503) };
    if (!ID_OK.test(e || "") || !COD_OK.test(c || "")) return { erro: json({ erro: "Link inválido." }, 404) };
    var conv = {};
    try { conv = JSON.parse((await env.DADOS.get("convidados")) || "{}"); } catch (x) { conv = {}; }
    var p = (conv[e] || []).filter(function (x) { return x && x.c === c; })[0];
    if (!p) return { erro: json({ erro: "Convite não encontrado." }, 404) };
    return { p: p, chave: "resposta:" + e + ":" + c };
}

export async function onRequestGet(context) {
    var u = new URL(context.request.url);
    var a = await achar(context.env, u.searchParams.get("e"), u.searchParams.get("c"));
    if (a.erro) return a.erro;
    var r = await context.env.DADOS.getWithMetadata(a.chave);
    var resposta = r && r.metadata ? r.metadata.r : (a.p.confirmado ? "sim" : a.p.naoVai ? "nao" : "");
    return json({ nome: String(a.p.nome || "").trim().split(/\s+/)[0], resposta: resposta || "" });
}

export async function onRequestPost(context) {
    var corpo;
    try { corpo = await context.request.json(); } catch (x) { return json({ erro: "Dados inválidos." }, 400); }
    if (corpo.resposta !== "sim" && corpo.resposta !== "nao") return json({ erro: "Resposta inválida." }, 400);
    var a = await achar(context.env, corpo.e, corpo.c);
    if (a.erro) return a.erro;
    var em = new Date().toISOString();
    await context.env.DADOS.put(a.chave, "", { metadata: { r: corpo.resposta, em: em } });
    return json({ ok: true, resposta: corpo.resposta });
}
