/* =========================================================
   /api/admin/login — entrada no painel com a senha (ADMIN_SENHA).
   Depois de 8 tentativas erradas, bloqueia aquele endereço por 15 min.
   ========================================================= */

import { senhaConfere, cookieSessao, equipe, json } from "../../../lib/acesso.js";

export async function onRequestPost(context) {
    var env = context.env, request = context.request;
    if (equipe(env)) return json({ erro: "Este painel usa o login do Cloudflare Access." }, 400);
    if (!env.ADMIN_SENHA) return json({ erro: "A senha do painel ainda não foi configurada.", codigo: "sem-login" }, 503);

    var ip = request.headers.get("CF-Connecting-IP") || "?";
    var chave = "falhas:" + ip;
    var falhas = env.DADOS ? +(await env.DADOS.get(chave) || 0) : 0;
    if (falhas >= 8) return json({ erro: "Muitas tentativas. Espere 15 minutos e tente de novo." }, 429);

    var corpo = {};
    try { corpo = await request.json(); } catch (e) {}

    if (!(await senhaConfere(env, corpo.senha))) {
        if (env.DADOS) await env.DADOS.put(chave, String(falhas + 1), { expirationTtl: 900 });
        return json({ erro: "Senha incorreta." }, 401);
    }

    if (env.DADOS && falhas) await env.DADOS.delete(chave);
    var r = json({ ok: true });
    r.headers.append("Set-Cookie", await cookieSessao(env));
    return r;
}
