/* =========================================================
   azulmarinhoinfo.com.br/sports/ → mostra a loja Azul Marinho Sports
   O endereço fica no portal; por baixo, as páginas vêm de
   sports.azulmarinhoinfo.com.br (que continua no ar para os clientes).
   Fotos e pedidos o navegador busca direto na loja (portal.js da Sports),
   então aqui só passam a página, os scripts, o estilo e o catálogo.
   ========================================================= */

var LOJA = "https://sports.azulmarinhoinfo.com.br";
var ORIGEM = "https://azulmarinho-sports.pages.dev"; /* mesmo site da loja, buscado pelo endereço do Cloudflare */

export async function onRequest(context) {
    var request = context.request, url = new URL(request.url);
    var resto = url.pathname.replace(/^\/sports/, "");
    if (resto === "") return Response.redirect(url.origin + "/sports/" + url.search + url.hash, 301);
    /* painel do lojista, fotos e pedidos ficam no endereço da loja */
    if (/^\/(admin|img|api)(\/|$)/.test(resto)) return Response.redirect(LOJA + resto + url.search, 302);
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Método não permitido.", { status: 405 });

    var res = await fetch(ORIGEM + resto + url.search, { method: request.method, headers: { "Accept": request.headers.get("Accept") || "*/*" } });
    res = new Response(res.body, res);
    res.headers.set("X-Robots-Tag", "noindex");
    /* Páginas da loja vistas pelo portal fazem parte do app da Azul Marinho (manifest + sw.js do portal) */
    if ((res.headers.get("Content-Type") || "").indexOf("text/html") === 0) {
        res = new HTMLRewriter().on("head", {
            element: function (head) {
                head.append('<link rel="manifest" href="/manifest.webmanifest">' +
                    '<link rel="apple-touch-icon" href="/assets/app/apple-touch-icon.png">' +
                    '<meta name="apple-mobile-web-app-title" content="Azul Marinho">' +
                    '<meta name="apple-mobile-web-app-capable" content="yes">' +
                    '<script>if("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js").catch(function(){})</script>', { html: true });
            }
        }).transform(res);
    }
    return res;
}
