/* =========================================================
   /api/fotos/<evento>/<id>         a foto
   /api/fotos/<evento>/<id>?mini    a miniatura
   DELETE (só com o login do painel) apaga a foto.
   ========================================================= */

import { conferirAcesso, json } from "../../../../lib/acesso.js";
import { chaveLista } from "../../../../lib/fotos.js";

var ID_OK = /^[a-z0-9][a-z0-9-]{0,79}$/, FOTO_OK = /^[a-z0-9]{4,30}$/;

export async function onRequestGet(context) {
    var p = context.params, kv = context.env.DADOS;
    if (!kv || !ID_OK.test(p.ev) || !FOTO_OK.test(p.id)) return new Response("Foto não encontrada.", { status: 404 });
    var tipo = new URL(context.request.url).searchParams.has("mini") ? "mini" : "foto";
    var r = await kv.getWithMetadata(tipo + ":" + p.ev + ":" + p.id, { type: "stream", cacheTtl: 3600 });
    if (!r.value) return new Response("Foto não encontrada.", { status: 404 });
    return new Response(r.value, {
        headers: {
            "Content-Type": (r.metadata && r.metadata.tipo) || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable"
        }
    });
}

export async function onRequestDelete(context) {
    var p = context.params, kv = context.env.DADOS;
    var acesso = await conferirAcesso(context.request, context.env);
    if (acesso.erro) return json({ erro: acesso.erro, codigo: acesso.codigo }, acesso.status);
    if (!kv || !ID_OK.test(p.ev) || !FOTO_OK.test(p.id)) return json({ erro: "Foto inválida." }, 400);
    await kv.delete("foto:" + p.ev + ":" + p.id);
    await kv.delete("mini:" + p.ev + ":" + p.id);
    context.waitUntil(caches.default.delete(chaveLista(context.request, p.ev)));
    return json({ ok: true });
}
