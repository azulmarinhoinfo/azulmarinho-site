/* =========================================================
   /api/fotos/<id-do-evento> — fotos que os convidados enviam pelo site.
   GET   lista das fotos (pública)
   POST  envia uma foto (pública, sem login). O navegador já manda
         a foto diminuída: "foto" (até 1600 px) e "mini" (até 480 px).
   As fotos ficam no KV "DADOS":
     foto:<evento>:<id>   a foto        metadata { nome, quando }
     mini:<evento>:<id>   a miniatura
   Para apagar uma foto: painel do organizador (/api/fotos/<evento>/<id>).
   ========================================================= */

import { json } from "../../../lib/acesso.js";
import { chaveLista } from "../../../lib/fotos.js";

var ID_OK = /^[a-z0-9][a-z0-9-]{0,79}$/;
var TIPOS = { "image/jpeg": 1, "image/png": 1, "image/webp": 1 };
var MAX_FOTO = 4 * 1024 * 1024, MAX_MINI = 600 * 1024;

async function eventoExiste(kv, ev) {
    try {
        var lista = JSON.parse((await kv.get("eventos")) || "[]");
        return lista.some(function (e) { return e && e.id === ev; });
    } catch (e) { return false; }
}

export async function onRequestGet(context) {
    var ev = context.params.ev, kv = context.env.DADOS;
    if (!ID_OK.test(ev)) return json({ erro: "Evento inválido." }, 400);
    if (!kv) return json({ fotos: [] });

    var fresco = new URL(context.request.url).searchParams.has("fresco");
    var cache = caches.default, chave = chaveLista(context.request, ev);
    if (!fresco) {
        var guardada = await cache.match(chave);
        if (guardada) return guardada;
    }

    var fotos = [], cursor;
    do {
        var r = await kv.list({ prefix: "foto:" + ev + ":", cursor: cursor });
        r.keys.forEach(function (k) {
            var m = k.metadata || {};
            fotos.push({ id: k.name.split(":")[2], nome: m.nome || "", quando: m.quando || 0 });
        });
        cursor = r.list_complete ? null : r.cursor;
    } while (cursor);
    fotos.sort(function (a, b) { return a.quando - b.quando; });

    var resposta = json({ fotos: fotos });
    resposta.headers.set("Cache-Control", "public, max-age=30");
    if (!fresco) context.waitUntil(cache.put(chave, resposta.clone()));
    return resposta;
}

export async function onRequestPost(context) {
    var ev = context.params.ev, kv = context.env.DADOS;
    if (!ID_OK.test(ev)) return json({ erro: "Evento inválido." }, 400);
    if (!kv) return json({ erro: "O armazenamento ainda não foi ligado." }, 503);
    if (!(await eventoExiste(kv, ev))) return json({ erro: "Evento não encontrado." }, 404);

    var form;
    try { form = await context.request.formData(); } catch (e) { return json({ erro: "Envio inválido." }, 400); }
    var foto = form.get("foto"), mini = form.get("mini");
    if (!foto || typeof foto === "string" || !mini || typeof mini === "string") return json({ erro: "Faltou a foto." }, 400);
    if (!TIPOS[foto.type] || !TIPOS[mini.type]) return json({ erro: "Esse tipo de arquivo não é aceito." }, 415);
    if (foto.size > MAX_FOTO || mini.size > MAX_MINI) return json({ erro: "Foto grande demais." }, 413);

    var nome = String(form.get("nome") || "").replace(/\s+/g, " ").trim().slice(0, 60);
    var quando = Date.now();
    var id = quando.toString(36) + Math.random().toString(36).slice(2, 8);

    await kv.put("mini:" + ev + ":" + id, await mini.arrayBuffer(), { metadata: { tipo: mini.type } });
    await kv.put("foto:" + ev + ":" + id, await foto.arrayBuffer(), { metadata: { nome: nome, quando: quando, tipo: foto.type } });
    context.waitUntil(caches.default.delete(chaveLista(context.request, ev)));
    return json({ ok: true, foto: { id: id, nome: nome, quando: quando } });
}
