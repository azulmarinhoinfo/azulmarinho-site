/* =========================================================
   /api/piscina/teste-ia — diagnóstico rápido da IA do diário
   GET (só com o login do painel). Faz 3 testes curtos em paralelo e mostra
   quanto cada um demorou: lista de modelos, um "oi" no modelo configurado
   e um "oi" num modelo leve. Não mostra a chave.
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";

var BASE = "https://generativelanguage.googleapis.com/v1beta/";

async function teste(nome, url, opcoes) {
    var ini = Date.now(), ctl = new AbortController();
    var tm = setTimeout(function () { ctl.abort(); }, 20000);
    try {
        var r = await fetch(url, Object.assign({ signal: ctl.signal }, opcoes));
        var corpo = await r.text();
        return { teste: nome, status: r.status, ms: Date.now() - ini, resposta: corpo.slice(0, 600), corpo: corpo };
    } catch (e) {
        return { teste: nome, ms: Date.now() - ini, falha: ctl.signal.aborted ? "sem resposta em 20 s" : String(e && e.message || e) };
    } finally {
        clearTimeout(tm);
    }
}

function oi(modelo, chave) {
    return teste("oi " + modelo, BASE + "models/" + modelo + ":generateContent", {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": chave },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Responda só: oi" }] }] })
    });
}

export async function onRequestGet(context) {
    var env = context.env;
    var acesso = await conferirAcesso(context.request, env);
    if (acesso.erro) return json({ erro: acesso.erro, codigo: acesso.codigo }, acesso.status);
    if (!env.GEMINI_API_KEY) return json({ erro: "GEMINI_API_KEY não está configurada." });
    var chave = env.GEMINI_API_KEY;
    var resultados = await Promise.all([
        teste("lista de modelos", BASE + "models?pageSize=100", { headers: { "x-goog-api-key": chave } }),
        oi(env.GEMINI_MODEL || "gemini-3.5-flash", chave),
        oi("gemini-3.5-flash-lite", chave)
    ]);
    var lista = resultados[0];
    try {
        var nomes = (JSON.parse(lista.corpo || "{}").models || []).map(function (m) { return m.name.replace("models/", ""); });
        if (nomes.length) lista.resposta = nomes.join(", ");
    } catch (e) {}
    resultados.forEach(function (x) { delete x.corpo; });
    return json({ chave: "começa com " + chave.slice(0, 3) + "… (" + chave.length + " caracteres)", colo: (context.request.cf || {}).colo, resultados: resultados });
}
