/* =========================================================
   Endereços próprios das páginas, sem o menu do portal (assets/js/site.js):
     informatica.azulmarinhoinfo.com.br → /informatica/
     eventos.azulmarinhoinfo.com.br     → /eventos/
     piscina.azulmarinhoinfo.com.br     → /piscina/
   O endereço continua o mesmo na barra; por baixo, o Cloudflare entrega
   a página. Os links internos (/eventos/evento?id=...) funcionam no
   mesmo endereço. Qualquer outro endereço segue normal.

   A Piscina (/piscina/ e piscina.azulmarinhoinfo.com.br) é particular:
   página, fotos e scripts só abrem com a senha do painel (ADMIN_SENHA,
   a mesma do /admin/). Sem login, aparece a tela de senha.
   Fica aberto só o passo a passo (/piscina/passo-a-passo/) e as fotos
   dele: as da válvula e os recortes do equipamento (fotos/r-*.jpg).
   ========================================================= */

import { conferirAcesso } from "../lib/acesso.js";
import { paginaSenha } from "../lib/piscina-trava.js";

export async function onRequest(context) {
    var url = new URL(context.request.url);
    var m = url.hostname.match(/^(informatica|eventos|piscina)\./);
    var raiz = url.pathname === "/" || url.pathname === "/index.html";
    var caminho = url.pathname;
    try { caminho = decodeURIComponent(caminho); } catch (e) {}
    caminho = caminho.toLowerCase().replace(/\/{2,}/g, "/");
    var aberto = /^\/piscina\/(passo-a-passo(\/(index\.html)?)?|valvula-[a-z0-9-]+\.jpg|fotos\/r-[a-z0-9-]+\.jpg)$/.test(caminho);
    if (!aberto && (caminho === "/piscina" || caminho.indexOf("/piscina/") === 0 || (m && m[1] === "piscina" && raiz))) {
        var acesso = await conferirAcesso(context.request, context.env);
        if (acesso.erro) return paginaSenha(acesso.codigo === "sem-login");
    }
    if (m && raiz) {
        return context.env.ASSETS.fetch(new Request(new URL("/" + m[1] + "/" + url.search, url), context.request));
    }
    return context.next();
}
