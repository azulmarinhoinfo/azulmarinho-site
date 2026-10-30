/* =========================================================
   /api/piscina/foto?id=... — mostra uma foto do diário da piscina
   Só com o login do painel.
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";
import { chaveFoto, ID_OK } from "../../../lib/piscina.js";

export async function onRequestGet(context) {
    var env = context.env;
    var acesso = await conferirAcesso(context.request, env);
    if (acesso.erro) return json({ erro: acesso.erro }, acesso.status);
    var id = new URL(context.request.url).searchParams.get("id") || "";
    if (!ID_OK.test(id) || !env.DADOS) return json({ erro: "Foto não encontrada." }, 404);
    var r = await env.DADOS.getWithMetadata(chaveFoto(id), { type: "arrayBuffer" });
    if (!r.value) return json({ erro: "Foto não encontrada." }, 404);
    return new Response(r.value, {
        headers: {
            "Content-Type": (r.metadata && r.metadata.tipo) || "image/jpeg",
            "Cache-Control": "private, max-age=31536000, immutable",
            "X-Robots-Tag": "noindex"
        }
    });
}
