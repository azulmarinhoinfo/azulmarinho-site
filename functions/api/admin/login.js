/* =========================================================
   /api/admin/login — entrada no painel com a senha.
   ADMIN_SENHA entra como administrador; a senha de um operador cadastrado
   (botão "👤 Acessos" do painel, KV "usuarios") entra como operador.
   Depois de 8 tentativas erradas, bloqueia aquele endereço por 15 min.
   ========================================================= */

import { senhaConfere, cookieSessao, cookieOperador, acharOperador, usuarioAdmin, chaveUsuario, cookieSair, equipe, json } from "../../../lib/acesso.js";

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

    /* Com usuário (tela "Entrar"): farley + ADMIN_SENHA, ou o usuário de um operador. Sem usuário: só a senha. */
    var usuario = chaveUsuario(corpo.usuario);
    var admin = (!usuario || usuario === usuarioAdmin(env)) && await senhaConfere(env, corpo.senha);
    var op = admin ? null : await acharOperador(env, corpo.senha, usuario);
    if (!admin && !op) {
        if (env.DADOS) await env.DADOS.put(chave, String(falhas + 1), { expirationTtl: 900 });
        return json({ erro: usuario ? "Usuário ou senha incorretos." : "Senha incorreta." }, 401);
    }

    if (env.DADOS && falhas) await env.DADOS.delete(chave);
    var r = json({ ok: true, papel: admin ? "admin" : "operador" });
    cookieSair(request).forEach(function (c) { r.headers.append("Set-Cookie", c); });   // tira o login antigo, só do endereço
    r.headers.append("Set-Cookie", admin ? await cookieSessao(env, request) : await cookieOperador(env, op, request));
    return r;
}
