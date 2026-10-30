/* =========================================================
   piscina.azulmarinhoinfo.com.br → mostra o Plano da Piscina
   O endereço continua "piscina.azulmarinhoinfo.com.br" na barra;
   por baixo, o Cloudflare entrega a página /piscina/.
   Qualquer outro endereço segue normal.
   ========================================================= */

export async function onRequest(context) {
    var url = new URL(context.request.url);
    if (url.hostname.indexOf("piscina.") === 0 && (url.pathname === "/" || url.pathname === "/index.html")) {
        return context.env.ASSETS.fetch(new Request(new URL("/piscina/", url), context.request));
    }
    return context.next();
}
