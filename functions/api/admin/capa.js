/* =========================================================
   /api/admin/capa — envia a foto de capa de um evento (escolhida na fototeca).
   Só com o login do painel. O painel já reduz a foto (lado maior 1600 px, JPEG)
   antes de enviar. Fica no KV "DADOS" como capa:<código> e aparece em
   /eventos/capa?f=<código> (functions/eventos/capa.js).
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";

var MAX = 5 * 1024 * 1024;

export async function onRequestPost(context) {
    var env = context.env, request = context.request;
    var acesso = await conferirAcesso(request, env);
    if (acesso.erro) return json({ erro: acesso.erro }, acesso.status);
    if (!env.DADOS) return json({ erro: "Falta ligar o armazenamento (KV DADOS)." }, 503);
    var tipo = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
    if (!/^image\/(jpeg|png|webp)$/.test(tipo)) return json({ erro: "Só dá para enviar fotos (JPG, PNG ou WebP)." }, 400);
    var dados = await request.arrayBuffer();
    if (!dados.byteLength) return json({ erro: "A foto chegou vazia. Tente de novo." }, 400);
    if (dados.byteLength > MAX) return json({ erro: "Foto grande demais. Tente outra." }, 413);
    var bytes = crypto.getRandomValues(new Uint8Array(12)), codigo = "";
    for (var i = 0; i < bytes.length; i++) codigo += ("0" + bytes[i].toString(16)).slice(-2);
    await env.DADOS.put("capa:" + codigo, dados, { metadata: { tipo: tipo, em: Date.now() } });
    return json({ caminho: "/eventos/capa?f=" + codigo });
}
