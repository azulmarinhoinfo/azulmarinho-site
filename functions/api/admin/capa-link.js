/* =========================================================
   /api/admin/capa-link?url=<link> — busca uma imagem achada na internet
   (botão "🔎 Pesquisar na internet" da Foto de capa) e devolve os bytes
   para o painel. O navegador não consegue baixar imagens de outros sites
   sozinho (bloqueio de CORS); por isso o site busca e repassa.
   O painel reduz a foto e envia por /api/admin/capa, igual à fototeca:
   assim a capa fica guardada no site e não some se o outro site apagar.
   Só com o login do painel.
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";

var MAX = 15 * 1024 * 1024;

export async function onRequestGet(context) {
    var env = context.env, request = context.request;
    var acesso = await conferirAcesso(request, env);
    if (acesso.erro) return json({ erro: acesso.erro }, acesso.status);
    var link = new URL(request.url).searchParams.get("url") || "", alvo;
    try { alvo = new URL(link); } catch (e) { return json({ erro: "Esse link não é válido." }, 400); }
    if (!/^https?:$/.test(alvo.protocol)) return json({ erro: "Esse link não é válido." }, 400);
    var r;
    try {
        r = await fetch(alvo.toString(), {
            redirect: "follow",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
                "Accept": "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8"
            }
        });
    } catch (e) {
        return json({ erro: "O site da imagem não respondeu." }, 502);
    }
    if (!r.ok) return json({ erro: "O site da imagem não deixou baixar (erro " + r.status + ")." }, 502);
    var tipo = (r.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
    if (!/^image\//.test(tipo)) return json({ erro: "Esse link é de uma página, não da imagem. Use \"Copiar endereço da imagem\"." }, 415);
    var dados = await r.arrayBuffer();
    if (!dados.byteLength) return json({ erro: "A imagem veio vazia." }, 502);
    if (dados.byteLength > MAX) return json({ erro: "Imagem grande demais." }, 413);
    return new Response(dados, { headers: { "Content-Type": tipo, "Cache-Control": "no-store" } });
}
