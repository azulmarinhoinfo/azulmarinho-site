/* =========================================================
   /eventos/dados — a lista pública de eventos que as páginas leem.
   Se o painel já salvou eventos no Cloudflare (KV "DADOS"), usa eles.
   Senão, usa o arquivo eventos/eventos.js do site.
   Convidados NUNCA saem daqui: eles ficam só no painel.
   ========================================================= */

export async function onRequestGet(context) {
    var env = context.env, request = context.request;
    var eventos = null;

    if (env.DADOS) {
        try {
            var texto = await env.DADOS.get("eventos");
            if (texto) eventos = JSON.parse(texto);
        } catch (e) { eventos = null; }
    }

    if (!Array.isArray(eventos)) {
        return env.ASSETS.fetch(new URL("/eventos/eventos.js", request.url));
    }

    var publicos = eventos.filter(function (ev) { return ev && !ev.rascunho; });
    return new Response("window.EVENTOS = " + JSON.stringify(publicos) + ";\n", {
        headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "public, max-age=30"
        }
    });
}
