/* =========================================================
   Endereços próprios das páginas, sem o menu do portal (assets/js/site.js):
     informatica.azulmarinhoinfo.com.br → /informatica/
     eventos.azulmarinhoinfo.com.br     → /eventos/
     piscina.azulmarinhoinfo.com.br     → /piscina/
   O endereço continua o mesmo na barra; por baixo, o Cloudflare entrega
   a página. Os links internos (/eventos/evento?id=...) funcionam no
   mesmo endereço. Qualquer outro endereço segue normal.
   ========================================================= */

export async function onRequest(context) {
    var url = new URL(context.request.url);
    var m = url.hostname.match(/^(informatica|eventos|piscina)\./);
    if (m && (url.pathname === "/" || url.pathname === "/index.html")) {
        return context.env.ASSETS.fetch(new Request(new URL("/" + m[1] + "/" + url.search, url), context.request));
    }
    return context.next();
}
